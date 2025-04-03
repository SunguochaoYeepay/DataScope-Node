/**
 * Express请求扩展定义
 */
import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name?: string;
        roles?: string[];
      };
    }
  }
}