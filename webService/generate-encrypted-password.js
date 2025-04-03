/**
 * 生成加密密码脚本
 */
const crypto = require('crypto');

// 从环境变量文件中读取加密密钥
require('dotenv').config();
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your_encryption_key_32chars_long';

/**
 * 生成随机盐值
 */
function generateSalt(length = 16) {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * 加密密码
 */
function encrypt(text, salt) {
  const useSalt = salt || generateSalt();
  
  // 使用盐值来强化密钥
  const key = crypto.scryptSync(ENCRYPTION_KEY, useSalt, 32);
  
  // 生成随机初始化向量
  const iv = crypto.randomBytes(16);
  
  // 创建加密器
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  
  // 加密文本
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // 将 IV 和加密后的文本拼接在一起
  const result = iv.toString('hex') + encrypted;
  
  return {
    encrypted: result,
    salt: useSalt
  };
}

// 为MariaDB生成加密密码
const mariadbPassword = 'datascope';
const mariadbSalt = generateSalt();
const mariadbEncrypted = encrypt(mariadbPassword, mariadbSalt);

console.log('=== MariaDB数据源加密信息 ===');
console.log('密码明文:', mariadbPassword);
console.log('盐值:', mariadbSalt);
console.log('加密密码:', mariadbEncrypted.encrypted);
console.log();

// 为MySQL生成加密密码
const mysqlPassword = 'root';
const mysqlSalt = generateSalt();
const mysqlEncrypted = encrypt(mysqlPassword, mysqlSalt);

console.log('=== MySQL数据源加密信息 ===');
console.log('密码明文:', mysqlPassword);
console.log('盐值:', mysqlSalt);
console.log('加密密码:', mysqlEncrypted.encrypted);
console.log();

// 生成插入SQL
console.log('=== 插入SQL ===');
console.log(`
-- 插入MariaDB数据源
INSERT INTO tbl_data_source 
(id, name, description, type, host, port, databaseName, username, passwordEncrypted, passwordSalt, status, syncFrequency, nonce, createdAt, updatedAt, createdBy, updatedBy, active)
VALUES
(UUID(), 'MariaDB数据库', '本地MariaDB容器', 'MYSQL', 'host.docker.internal', 3306, 'datascope', 'root', '${mariadbEncrypted.encrypted}', '${mariadbSalt}', 'ACTIVE', 'MANUAL', 0, NOW(), NOW(), 'system', 'system', 1);
`); 