/**
 * 生成加密密码脚本
 * 使用简化的加密逻辑生成密码
 */
const crypto = require('crypto');

// 简化的加密函数
function encrypt(text) {
  // 生成随机盐值
  const salt = crypto.randomBytes(16).toString('hex');
  
  // 从盐值派生密钥
  const key = crypto.scryptSync(salt, 'datascope', 32);
  
  // 生成随机IV
  const iv = crypto.randomBytes(16);
  
  // 创建加密器
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  
  // 加密数据
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // 将IV附加到加密结果
  const ivHex = iv.toString('hex');
  return { 
    encrypted: encrypted + ':' + ivHex, 
    salt 
  };
}

// 测试几个密码
const passwords = ['root', 'datascope', 'postgres', 'readonly'];

console.log('生成加密密码:');
console.log('==========================================');

passwords.forEach(password => {
  const { encrypted, salt } = encrypt(password);
  console.log(`原始密码: ${password}`);
  console.log(`加密密码: '${encrypted}'`);
  console.log(`盐值: '${salt}'`);
  console.log('------------------------------------------');
});