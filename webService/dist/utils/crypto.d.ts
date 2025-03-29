/**
 * 加密工具
 */
/**
 * 生成随机盐值
 */
export declare function generateSalt(length?: number): string;
/**
 * 使用 AES-256-CBC 加密字符串
 * @param text 要加密的文本
 * @param salt 盐值 (可选)
 * @returns 加密结果对象，包含加密后的文本和使用的盐值
 */
export declare function encrypt(text: string, salt?: string): {
    encrypted: string;
    salt: string;
};
/**
 * 解密 AES-256-CBC 加密的字符串
 * @param encryptedText 加密后的文本
 * @param salt 加密时使用的盐值
 * @returns 解密后的原始文本
 */
export declare function decrypt(encryptedText: string, salt: string): string;
/**
 * 哈希密码
 * @param password 密码明文
 * @param salt 盐值 (可选)
 * @returns 哈希结果对象，包含哈希后的密码和使用的盐值
 */
export declare function hashPassword(password: string, salt?: string): {
    hash: string;
    salt: string;
};
/**
 * 验证密码
 * @param password 待验证的密码明文
 * @param hash 存储的密码哈希
 * @param salt 存储的盐值
 * @returns 密码是否匹配
 */
export declare function verifyPassword(password: string, hash: string, salt: string): boolean;
/**
 * 加密密码 - hashPassword的别名
 * @param password 密码明文
 * @param salt 盐值 (可选)
 * @returns 哈希结果对象，包含哈希后的密码和使用的盐值
 */
export declare const encryptPassword: typeof hashPassword;
/**
 * 比较密码 - verifyPassword的别名
 * @param password 待验证的密码明文
 * @param hash 存储的密码哈希
 * @param salt 存储的盐值
 * @returns 密码是否匹配
 */
export declare const comparePassword: typeof verifyPassword;
