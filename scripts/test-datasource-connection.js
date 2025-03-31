/**
 * 测试数据源连接脚本
 * 使用数据库中的数据源信息尝试连接
 */
const mysql = require('mysql2/promise');
const crypto = require('crypto');

// 与webService/src/utils/crypto.ts中相同的加密密钥
const ENCRYPTION_KEY = 'datascope-default-encryption-key-12345';

/**
 * 解密AES-256-CBC加密的字符串
 * @param {string} encryptedText 加密后的文本 
 * @param {string} salt 加密时使用的盐值
 * @returns {string} 解密后的原始文本
 */
function decrypt(encryptedText, salt) {
  try {
    // 使用盐值来派生出与加密时相同的密钥
    const key = crypto.scryptSync(ENCRYPTION_KEY, salt, 32);
    
    // 从加密文本中提取IV（前32个字符，hex编码后的16字节）
    const iv = Buffer.from(encryptedText.slice(0, 32), 'hex');
    
    // 获取实际加密的数据部分
    const encryptedData = encryptedText.slice(32);
    
    // 创建解密器
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    
    // 解密
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (err) {
    console.error('解密失败:', err);
    throw new Error('解密失败');
  }
}

async function testDataSourceConnection() {
  try {
    // 数据源信息，来自数据库
    const dataSource = {
      id: 'ds001',
      name: '本地MySQL开发数据库',
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      databaseName: 'datascope',
      username: 'root',
      passwordEncrypted: '313635a796bbf4fb265b98822b2cd0a2b8e89c410ca0a4bc3a89d46e5a6093dd',
      passwordSalt: '95abc3504882021b500a5582b85cc6d5'
    };

    // 解密密码
    const password = decrypt(dataSource.passwordEncrypted, dataSource.passwordSalt);
    console.log('解密后的密码:', password);

    // 创建数据库连接配置
    const config = {
      host: dataSource.host,
      port: dataSource.port,
      user: dataSource.username,
      password: password,
      database: dataSource.databaseName
    };

    console.log('连接配置:', {
      host: config.host,
      port: config.port,
      user: config.user,
      database: config.database
    });

    // 创建数据库连接
    console.log('尝试连接数据库...');
    const connection = await mysql.createConnection(config);
    
    // 测试查询
    console.log('执行测试查询...');
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM tbl_data_source');
    
    console.log('查询结果:', rows);
    console.log('数据源连接测试成功!');
    
    // 关闭连接
    await connection.end();
  } catch (error) {
    console.error('测试数据源连接失败:', error);
  }
}

// 执行测试
testDataSourceConnection();