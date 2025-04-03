/**
 * 身份验证工具
 */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

/**
 * 用户信息接口
 */
interface UserPayload {
  email: string;
  role: string;
  id?: string;
  name?: string;
}

/**
 * 生成JWT令牌
 * @param payload 用户信息
 * @returns JWT令牌
 */
export const generateToken = (payload: UserPayload): string => {
  const secret = process.env.JWT_SECRET || 'default-secret-key';
  const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
  
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * 验证JWT令牌
 * @param token JWT令牌
 * @returns 解码后的用户信息或null
 */
export const verifyToken = (token: string): UserPayload | null => {
  try {
    const secret = process.env.JWT_SECRET || 'default-secret-key';
    return jwt.verify(token, secret) as UserPayload;
  } catch (error) {
    return null;
  }
};

/**
 * 生成密码哈希
 * @param password 原始密码
 * @returns 哈希后的密码
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

/**
 * 验证密码
 * @param password 原始密码
 * @param hash 哈希后的密码
 * @returns 是否匹配
 */
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};