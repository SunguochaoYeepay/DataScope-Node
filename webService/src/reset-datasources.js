/**
 * 重置数据源：清除所有数据源，然后添加本地MySQL和Docker MariaDB两个数据源
 */
const mysql = require('mysql2/promise');
const crypto = require('crypto');

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
 * 使用 AES-256-CBC 加密字符串
 * @param {string} text 要加密的文本
 * @param {string} salt 盐值 (可选)
 * @returns {object} 加密结果对象，包含加密后的文本和使用的盐值
 */
function encrypt(text, salt) {
  const useSalt = salt || generateSalt();
  
  // 使用盐值来强化密钥，避免相同的文本总是产生相同的加密结果
  const key = crypto.scryptSync(ENCRYPTION_KEY, useSalt, 32);
  
  // 生成随机初始化向量
  const iv = crypto.randomBytes(16);
  
  // 创建加密器
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  
  // 加密文本
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // 将 IV 和加密后的文本拼接在一起，以便解密时使用
  const result = iv.toString('hex') + encrypted;
  
  return {
    encrypted: result,
    salt: useSalt
  };
}

// 创建明文凭证，用于开发环境
function createPlaintextCredentials(password) {
  return {
    encrypted: password,
    salt: password
  };
}

async function resetDataSources() {
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
    
    // 清除所有现有数据源（设置为非活跃状态）
    console.log('清除所有现有数据源...');
    await connection.execute('UPDATE tbl_data_source SET active = 0 WHERE 1=1');
    
    console.log('所有数据源已设置为非活跃状态');
    
    // 加密密码 - 使用明文凭证以便于开发环境
    const mysqlPassword = 'Datascopedb123!';
    const mariadbPassword = 'datascope'; // MariaDB通常使用默认密码
    const mysqlEncryption = createPlaintextCredentials(mysqlPassword);
    const mariadbEncryption = createPlaintextCredentials(mariadbPassword);
    
    // 创建本地MySQL数据源
    console.log('创建本地MySQL数据源...');
    await connection.execute(`
      INSERT INTO tbl_data_source 
      (id, name, description, type, host, port, username, passwordEncrypted, passwordSalt, databaseName, status, active, createdAt, updatedAt, createdBy, updatedBy, nonce, syncFrequency, lastSyncTime) 
      VALUES 
      (UUID(), '本地MySQL(可连接)', '本地MySQL数据库，可以成功连接', 'mysql', 'localhost', 3306, 'root', ?, ?, 'datascope', 'ACTIVE', 1, NOW(), NOW(), 'system', 'system', 1, 3600, NULL)
    `, [mysqlEncryption.encrypted, mysqlEncryption.salt]);
    
    // 创建Docker MariaDB数据源 - 直接使用Docker内部IP
    console.log('创建Docker MariaDB数据源...');
    await connection.execute(`
      INSERT INTO tbl_data_source 
      (id, name, description, type, host, port, username, passwordEncrypted, passwordSalt, databaseName, status, active, createdAt, updatedAt, createdBy, updatedBy, nonce, syncFrequency, lastSyncTime) 
      VALUES 
      (UUID(), '本地MariaDB(可连接)', 'Docker容器中的MariaDB数据库', 'mysql', '172.19.0.2', 3306, 'root', ?, ?, 'datascope', 'ACTIVE', 1, NOW(), NOW(), 'system', 'system', 1, 3600, NULL)
    `, [mariadbEncryption.encrypted, mariadbEncryption.salt]);
    
    console.log('数据源创建完成!');
    
    // 验证数据源
    const [dataSources] = await connection.query('SELECT id, name, type, host, port, databaseName, status, active FROM tbl_data_source WHERE active = 1');
    
    console.log('活跃的数据源:');
    dataSources.forEach(ds => {
      console.log(`- ${ds.name} (${ds.id}): ${ds.type} ${ds.host}:${ds.port}/${ds.databaseName} 状态: ${ds.status}`);
    });
    
    // 关闭连接
    await connection.end();
    console.log('数据库连接已关闭');
  } catch (error) {
    console.error('重置数据源时出错:', error);
  }
}

// 执行重置
resetDataSources();