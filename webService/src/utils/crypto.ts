/**
 * 加密工具
 */

import * as crypto from 'crypto';
import config from '../config/env';

// 从环境变量获取加密密钥，如果没有则使用默认密钥
const ENCRYPTION_KEY = config.security.encryptionKey || 'datascope-default-encryption-key-12345';

/**
 * 生成随机盐值
 */
export function generateSalt(length: number = 16): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * 使用 AES-256-CBC 加密字符串
 * @param text 要加密的文本
 * @param salt 盐值 (可选)
 * @returns 加密结果对象，包含加密后的文本和使用的盐值
 */
export function encrypt(text: string, salt?: string): { encrypted: string; salt: string } {
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
 * 解密 AES-256-CBC 加密的字符串
 * @param encryptedText 加密后的文本 
 * @param salt 加密时使用的盐值
 * @returns 解密后的原始文本
 */
export function decrypt(encryptedText: string, salt: string): string {
  try {
    // 使用盐值来派生出与加密时相同的密钥
    const key = crypto.scryptSync(ENCRYPTION_KEY, salt, 32);
    
    // 从加密文本中提取 IV（前32个字符，hex编码后的16字节）
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

/**
 * 哈希密码
 * @param password 密码明文
 * @param salt 盐值 (可选)
 * @returns 哈希结果对象，包含哈希后的密码和使用的盐值
 */
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const useSalt = salt || generateSalt();
  
  // 使用 PBKDF2 算法哈希密码
  const hashedPassword = crypto.pbkdf2Sync(
    password,
    useSalt,
    10000, // 迭代次数
    64,    // 密钥长度
    'sha512'
  ).toString('hex');
  
  return {
    hash: hashedPassword,
    salt: useSalt
  };
}

/**
 * 验证密码
 * @param password 待验证的密码明文
 * @param hash 存储的密码哈希
 * @param salt 存储的盐值
 * @returns 密码是否匹配
 */
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const hashedPassword = crypto.pbkdf2Sync(
    password,
    salt,
    10000,
    64,
    'sha512'
  ).toString('hex');
  
  return hashedPassword === hash;
}

/**
 * 加密密码 - hashPassword的别名
 * @param password 密码明文
 * @param salt 盐值 (可选)
 * @returns 哈希结果对象，包含哈希后的密码和使用的盐值
 */
export const encryptPassword = hashPassword;

/**
 * 比较密码 - verifyPassword的别名
 * @param password 待验证的密码明文
 * @param hash 存储的密码哈希
 * @param salt 存储的盐值
 * @returns 密码是否匹配
 */
export const comparePassword = verifyPassword;