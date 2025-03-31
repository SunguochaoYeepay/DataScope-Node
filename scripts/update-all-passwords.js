/**
 * 更新所有数据源的密码为统一的值
 * 使用与应用相同的加密逻辑
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

async function updateAllPasswords() {
  try {
    // 数据库连接配置
    const dbConfig = {
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: 'datascope',
      database: 'datascope',
      multipleStatements: true
    };
    
    console.log('连接数据库...');
    const connection = await mysql.createConnection(dbConfig);
    
    // 获取所有数据源
    console.log('获取所有数据源...');
    const [dataSources] = await connection.query('SELECT id, name, username FROM tbl_data_source');
    
    console.log(`找到 ${dataSources.length} 个数据源，开始更新密码...`);
    
    // 所有数据源都使用相同的密码: datascope
    const newPassword = 'datascope';
    
    // 对每个数据源更新密码
    for (const ds of dataSources) {
      // 为每个数据源生成不同的盐值，保障安全性
      const { encrypted, salt } = encrypt(newPassword);
      
      // 更新数据库
      console.log(`更新数据源 "${ds.name}" (${ds.id}) 的密码...`);
      await connection.execute(
        'UPDATE tbl_data_source SET passwordEncrypted = ?, passwordSalt = ? WHERE id = ?',
        [encrypted, salt, ds.id]
      );
    }
    
    console.log('所有数据源密码已更新!');
    
    // 验证更新
    console.log('验证密码更新...');
    const [updatedSources] = await connection.query(
      'SELECT id, name, passwordEncrypted, passwordSalt FROM tbl_data_source LIMIT 3'
    );
    
    console.log('更新后的数据（示例）:');
    updatedSources.forEach(ds => {
      console.log(`- ${ds.name} (${ds.id}):`);
      console.log(`  密码: ${ds.passwordEncrypted.substring(0, 20)}...`);
      console.log(`  盐值: ${ds.passwordSalt}`);
    });
    
    // 关闭连接
    await connection.end();
    console.log('数据库连接已关闭');
  } catch (error) {
    console.error('更新密码时出错:', error);
  }
}

// 执行更新
updateAllPasswords();