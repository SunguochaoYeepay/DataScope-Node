/**
 * 数据源密码加密工具
 * 使用与应用相同的加密逻辑
 */
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

/**
 * 加密数据源密码
 * @param {string} username 用户名
 * @param {string} password 密码
 * @returns {object} 包含加密密码和盐值
 */
function encryptDataSourcePassword(username, password) {
  const salt = generateSalt();
  const { encrypted } = encrypt(password, salt);
  
  return {
    username,
    password,
    passwordEncrypted: encrypted,
    passwordSalt: salt
  };
}

// 加密常用数据库密码
const credentials = [
  { username: 'root', password: 'root' },
  { username: 'root', password: 'datascope' },
  { username: 'datascope', password: 'datascope' },
  { username: 'postgres', password: 'postgres' },
  { username: 'readonly', password: 'readonly' }
];

console.log('生成数据源密码加密结果:');
console.log('=================================================');

credentials.forEach(({ username, password }) => {
  const result = encryptDataSourcePassword(username, password);
  console.log(`用户: ${result.username}`);
  console.log(`原始密码: ${result.password}`);
  console.log(`加密密码: ${result.passwordEncrypted}`);
  console.log(`盐值: ${result.passwordSalt}`);
  console.log('-------------------------------------------------');
});