// 确保代码中不生成模拟版本ID，使用后端提供的真实版本数据
// 如果存在formatVersionId函数，修改如下：

// 格式化版本ID为可读版本号
const formatVersionId = (versionId: string | null): string => {
  if (!versionId) return '无版本';
  
  // 使用真实的版本ID
  return versionId;
}

// 如果找不到formatVersionId函数，请手动搜索相关代码并修改 