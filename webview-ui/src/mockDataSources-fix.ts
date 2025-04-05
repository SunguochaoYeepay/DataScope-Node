// 修复文件 - mockDataSources被错误当作函数调用的问题
// 仅在Mock模式下执行
const isMockEnabled = import.meta.env.VITE_USE_MOCK_API === 'true';

// 只在Mock模式下执行以下代码
if (isMockEnabled) {
  import('./mock/data/datasource').then(module => {
    const { mockDataSources } = module;
    
    // 兼容函数 - 如果某处代码错误地将mockDataSources当作函数调用
    function mockDataSourcesFn() {
      console.warn('[警告] mockDataSources被当作函数调用，这是不正确的用法，应该直接访问数组');
      return [...mockDataSources];
    }
    
    // 替换全局对象，修复可能的错误
    (window as any).mockDataSources = mockDataSourcesFn;
    
    // 导出函数以供需要时使用
    console.log('[mockDataSources-fix] Mock修复已应用');
  }).catch(err => {
    console.error('[mockDataSources-fix] 加载Mock数据源失败:', err);
  });
} else {
  console.log('[mockDataSources-fix] 非Mock模式，跳过修复');
}
