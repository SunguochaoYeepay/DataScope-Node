/**
 * 创建示例数据：
 * 1. 添加MySQL数据源（本地数据库）
 * 2. 创建示例查询
 * 3. 创建示例集成
 */
const mysql = require('mysql2/promise');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

// 与webService/src/utils/crypto.ts中相同的加密密钥
const ENCRYPTION_KEY = 'datascope-default-encryption-key-12345';

/**
 * 生成随机盐值
 * @param {number} length 盐值长度
 * @returns {string} 生成的盐值
 */
function generateSalt(length = 16) {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * 创建明文凭证，用于开发环境
 */
function createPlaintextCredentials(password) {
  return {
    encrypted: password,
    salt: password
  };
}

/**
 * 创建示例数据
 */
async function createExamples() {
  try {
    // 数据库连接配置
    const dbConfig = {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'Datascopedb123!',
      database: 'datascope',
      multipleStatements: true
    };
    
    console.log('连接数据库...');
    const connection = await mysql.createConnection(dbConfig);
    
    // 1. 创建MySQL示例数据源
    console.log('创建MySQL示例数据源...');
    const mysqlDsId = uuidv4();
    const mysqlPassword = 'Datascopedb123!';
    const mysqlCreds = createPlaintextCredentials(mysqlPassword);
    
    await connection.execute(`
      INSERT INTO tbl_data_source 
      (id, name, description, type, host, port, username, passwordEncrypted, passwordSalt, databaseName, status, active, createdAt, updatedAt, createdBy, updatedBy, nonce, syncFrequency, lastSyncTime) 
      VALUES 
      (?, 'MySQL示例数据源', 'MySQL示例数据源，包含示例数据', 'mysql', 'localhost', 3306, 'root', ?, ?, 'datascope', 'ACTIVE', 1, NOW(), NOW(), 'system', 'system', 1, 3600, NULL)
    `, [mysqlDsId, mysqlCreds.encrypted, mysqlCreds.salt]);
    
    console.log(`创建的MySQL数据源ID: ${mysqlDsId}`);
    
    // 2. 创建示例查询
    console.log('创建示例查询...');
    // 查询1：查询所有数据源
    const query1Id = uuidv4();
    const query1SQL = 'SELECT id, name, type, host, port, databaseName, status FROM tbl_data_source WHERE active = 1';
    await connection.execute(`
      INSERT INTO tbl_query
      (id, name, description, dataSourceId, sqlContent, status, queryType, isFavorite, executionCount, lastExecutedAt, tags, createdAt, updatedAt, createdBy, updatedBy)
      VALUES
      (?, '所有数据源列表', '查询所有活跃的数据源信息', ?, ?, 'PUBLISHED', 'SELECT', 0, 0, NULL, 'demo,data-source', NOW(), NOW(), 'system', 'system')
    `, [query1Id, mysqlDsId, query1SQL]);
    
    // 查询2：查询系统用户
    const query2Id = uuidv4();
    const query2SQL = 'SELECT id, username, email, role, lastLoginAt FROM tbl_user';
    await connection.execute(`
      INSERT INTO tbl_query
      (id, name, description, dataSourceId, sqlContent, status, queryType, isFavorite, executionCount, lastExecutedAt, tags, createdAt, updatedAt, createdBy, updatedBy)
      VALUES
      (?, '系统用户列表', '查询所有注册用户的基本信息', ?, ?, 'PUBLISHED', 'SELECT', 0, 0, NULL, 'demo,user', NOW(), NOW(), 'system', 'system')
    `, [query2Id, mysqlDsId, query2SQL]);
    
    // 查询3：统计信息
    const query3Id = uuidv4();
    const query3SQL = 'SELECT COUNT(*) as total_integrations FROM tbl_integration; SELECT COUNT(*) as total_queries FROM tbl_query';
    await connection.execute(`
      INSERT INTO tbl_query
      (id, name, description, dataSourceId, sqlContent, status, queryType, isFavorite, executionCount, lastExecutedAt, tags, createdAt, updatedAt, createdBy, updatedBy)
      VALUES
      (?, '系统统计信息', '统计查询和集成的数量', ?, ?, 'PUBLISHED', 'SELECT', 1, 0, NULL, 'demo,statistics', NOW(), NOW(), 'system', 'system')
    `, [query3Id, mysqlDsId, query3SQL]);
    
    console.log('示例查询创建完成!');
    
    // 3. 创建查询版本
    console.log('为查询创建版本...');
    // 查询1版本
    const version1Id = uuidv4();
    await connection.execute(`
      INSERT INTO tbl_query_version
      (id, queryId, versionNumber, versionStatus, sqlContent, dataSourceId, description, createdAt, updatedAt, createdBy)
      VALUES
      (?, ?, 1, 'PUBLISHED', ?, ?, '初始版本', NOW(), NOW(), 'system')
    `, [version1Id, query1Id, query1SQL, mysqlDsId]);
    
    // 查询2版本
    const version2Id = uuidv4();
    await connection.execute(`
      INSERT INTO tbl_query_version
      (id, queryId, versionNumber, versionStatus, sqlContent, dataSourceId, description, createdAt, updatedAt, createdBy)
      VALUES
      (?, ?, 1, 'PUBLISHED', ?, ?, '初始版本', NOW(), NOW(), 'system')
    `, [version2Id, query2Id, query2SQL, mysqlDsId]);
    
    // 查询3版本
    const version3Id = uuidv4();
    await connection.execute(`
      INSERT INTO tbl_query_version
      (id, queryId, versionNumber, versionStatus, sqlContent, dataSourceId, description, createdAt, updatedAt, createdBy)
      VALUES
      (?, ?, 1, 'PUBLISHED', ?, ?, '初始版本', NOW(), NOW(), 'system')
    `, [version3Id, query3Id, query3SQL, mysqlDsId]);
    
    // 更新查询关联当前版本
    await connection.execute(`
      UPDATE tbl_query SET currentVersionId = ?, versionsCount = 1 WHERE id = ?
    `, [version1Id, query1Id]);
    
    await connection.execute(`
      UPDATE tbl_query SET currentVersionId = ?, versionsCount = 1 WHERE id = ?
    `, [version2Id, query2Id]);
    
    await connection.execute(`
      UPDATE tbl_query SET currentVersionId = ?, versionsCount = 1 WHERE id = ?
    `, [version3Id, query3Id]);
    
    console.log('查询版本创建完成!');
    
    // 4. 创建示例集成
    console.log('创建示例集成...');
    
    // REST API集成
    const integration1Id = uuidv4();
    await connection.execute(`
      INSERT INTO tbl_integration
      (id, name, description, type, config, status, createdAt, updatedAt, createdBy, updatedBy)
      VALUES
      (?, 'REST天气API集成', '连接到公共天气API服务示例', 'REST_API', ?, 'ACTIVE', NOW(), NOW(), 'system', 'system')
    `, [integration1Id, JSON.stringify({
      baseUrl: 'https://api.example.com/weather',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'sample-api-key'
      },
      timeout: 5000,
      endpoints: [{
        name: '获取城市天气',
        path: '/current/{city}',
        method: 'GET',
        parameters: [{
          name: 'city',
          type: 'path',
          required: true
        }, {
          name: 'units',
          type: 'query',
          required: false,
          default: 'metric'
        }]
      }]
    })]);
    
    // 数据库集成
    const integration2Id = uuidv4();
    await connection.execute(`
      INSERT INTO tbl_integration
      (id, name, description, type, config, status, createdAt, updatedAt, createdBy, updatedBy)
      VALUES
      (?, 'MySQL数据库集成', '连接到本地MySQL数据库的低代码集成', 'DATABASE', ?, 'ACTIVE', NOW(), NOW(), 'system', 'system')
    `, [integration2Id, JSON.stringify({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      database: 'datascope',
      username: 'root',
      queries: [{
        name: '获取用户信息',
        sql: 'SELECT * FROM tbl_user WHERE id = :userId',
        parameters: [{
          name: 'userId',
          type: 'string',
          required: true
        }]
      }]
    })]);
    
    console.log('示例集成创建完成!');
    
    // 验证数据源
    const [dataSources] = await connection.query('SELECT id, name, type, host, port, databaseName, status FROM tbl_data_source WHERE active = 1');
    console.log('活跃的数据源:');
    dataSources.forEach(ds => {
      console.log(`- ${ds.name} (${ds.id}): ${ds.type} ${ds.host}:${ds.port}/${ds.databaseName} 状态: ${ds.status}`);
    });
    
    // 验证查询
    const [queries] = await connection.query('SELECT id, name, description, dataSourceId FROM tbl_query');
    console.log('创建的查询:');
    queries.forEach(q => {
      console.log(`- ${q.name} (${q.id}): ${q.description}`);
    });
    
    // 验证集成
    const [integrations] = await connection.query('SELECT id, name, type, status FROM tbl_integration');
    console.log('创建的集成:');
    integrations.forEach(i => {
      console.log(`- ${i.name} (${i.id}): ${i.type} 状态: ${i.status}`);
    });
    
    // 关闭连接
    await connection.end();
    console.log('数据库连接已关闭');
    console.log('所有示例数据创建完成!');
  } catch (error) {
    console.error('创建示例数据时出错:', error);
  }
}

// 执行示例数据创建
createExamples();