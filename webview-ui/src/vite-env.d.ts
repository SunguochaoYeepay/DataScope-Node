/// <reference types="vite/client" />

// 解决Vite客户端代码变量重复声明问题
interface ImportMeta {
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
  readonly env: Record<string, string>
  glob(pattern: string): Record<string, unknown>
  readonly test?: boolean
  readonly __vite__injectQuery: string
}

// 解决Vue文件类型声明
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
