/// <reference types="vite/client" />

/**
 * 全局环境变量类型定义
 */
interface ImportMetaEnv {
  /**
   * API基础URL
   * 例如：http://localhost:3000, https://api.example.com
   */
  readonly VITE_API_BASE_URL: string;
  
  /**
   * 是否启用Mock API
   * 在开发环境中使用模拟数据代替真实API请求
   */
  readonly VITE_USE_MOCK_API: 'true' | 'false';
  
  /**
   * 环境名称
   * 例如：development, production, staging
   */
  readonly VITE_ENV: string;
  
  /**
   * 应用版本号
   */
  readonly VITE_APP_VERSION: string;
  
  /**
   * 构建时间戳
   */
  readonly VITE_BUILD_TIMESTAMP: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  readonly hot?: {
    readonly data: any
    accept(): void
    accept(cb: (mod: any) => void): void
    accept(dep: string, cb: (mod: any) => void): void
    accept(deps: readonly string[], cb: (mods: any[]) => void): void
    prune(cb: () => void): void
    dispose(cb: (data: any) => void): void
    decline(): void
    invalidate(): void
    on(event: string, cb: (...args: any[]) => void): void
  }
  glob(pattern: string): Record<string, unknown>
  readonly test?: boolean
  readonly __vite__injectQuery: string
}

// 解决Vue文件类型声明
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
