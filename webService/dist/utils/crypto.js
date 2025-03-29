"use strict";
/**
 * 加密工具
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.encryptPassword = void 0;
exports.generateSalt = generateSalt;
exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
const crypto = __importStar(require("crypto"));
const env_1 = __importDefault(require("../config/env"));
// 从环境变量获取加密密钥，如果没有则使用默认密钥
const ENCRYPTION_KEY = env_1.default.security.encryptionKey || 'datascope-default-encryption-key-12345';
/**
 * 生成随机盐值
 */
function generateSalt(length = 16) {
    return crypto.randomBytes(length).toString('hex');
}
/**
 * 使用 AES-256-CBC 加密字符串
 * @param text 要加密的文本
 * @param salt 盐值 (可选)
 * @returns 加密结果对象，包含加密后的文本和使用的盐值
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
 * 解密 AES-256-CBC 加密的字符串
 * @param encryptedText 加密后的文本
 * @param salt 加密时使用的盐值
 * @returns 解密后的原始文本
 */
function decrypt(encryptedText, salt) {
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
    }
    catch (err) {
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
function hashPassword(password, salt) {
    const useSalt = salt || generateSalt();
    // 使用 PBKDF2 算法哈希密码
    const hashedPassword = crypto.pbkdf2Sync(password, useSalt, 10000, // 迭代次数
    64, // 密钥长度
    'sha512').toString('hex');
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
function verifyPassword(password, hash, salt) {
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hashedPassword === hash;
}
/**
 * 加密密码 - hashPassword的别名
 * @param password 密码明文
 * @param salt 盐值 (可选)
 * @returns 哈希结果对象，包含哈希后的密码和使用的盐值
 */
exports.encryptPassword = hashPassword;
/**
 * 比较密码 - verifyPassword的别名
 * @param password 待验证的密码明文
 * @param hash 存储的密码哈希
 * @param salt 存储的盐值
 * @returns 密码是否匹配
 */
exports.comparePassword = verifyPassword;
//# sourceMappingURL=crypto.js.map