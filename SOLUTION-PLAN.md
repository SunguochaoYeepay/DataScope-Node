# DataScope解决方案计划

## 当前状态

我们已经成功解决了主要的数据库连接问题，基本接口已经恢复工作。目前：

1. **基础API功能可用**：
   - 健康检查
   - 数据源管理（查询、创建、删除）
   - 数据库连接测试

2. **仍存在的问题**：
   - 数据源密码加密/解密问题
   - 数据源更新API不可用
   - 查询执行API不可用
   - 部分元数据API未实现

## 问题分析

1. **密码加密/解密问题**：
   - 在`crypto.ts`中存在两套加密机制：
     - AES-256-CBC加密（encrypt/decrypt）
     - PBKDF2哈希（hashPassword/verifyPassword/encryptPassword/comparePassword）
   - 数据源密码使用了encryptPassword（实际是hashPassword）进行处理，但解密时尝试使用decrypt函数
   - 哈希是单向的，不能被解密，这导致解密失败

2. **元数据API缺失**：
   - 某些API路径在路由中未定义或路径有变化

## 解决方案

### 1. 修复密码加密/解密逻辑

需要修改DataSourceService中的加密和解密逻辑，确保一致性。有两种方案：

#### 方案A：使用可逆加密
```typescript
// 创建数据源时
const { encrypted, salt } = encrypt(password); // 使用AES加密而非哈希
return await prisma.dataSource.create({
  data: {
    // ...其他字段
    passwordEncrypted: encrypted,
    passwordSalt: salt,
  }
});

// 解密时
private decryptPassword(encryptedPassword: string, salt: string): string {
  try {
    return decrypt(encryptedPassword, salt); // 使用对应的解密函数
  } catch (error) {
    logger.error('解密数据源密码失败', { error });
    throw new ApiError('解密数据源密码失败', 500);
  }
}
```

#### 方案B：存储密码加密版本标志
修改数据库结构，添加密码加密版本字段，区分哈希和AES加密的密码，以支持向后兼容。

### 2. 完善元数据相关API

1. 实现缺失的API端点：
   - `/api/metadata/structure`
   - `/api/schemas`

2. 更新API文档，确保与实际实现一致

### 3. 增强测试覆盖率

1. 实现自动化API测试套件
2. 添加单元测试，特别是针对加密/解密功能
3. 创建集成测试，确保端到端流程正常工作

## 建议的修复优先级

1. 修复密码加密/解密逻辑 (高优先级)
2. 修复查询执行API (高优先级)
3. 修复数据源更新API (中优先级)
4. 实现元数据API (中优先级)
5. 增强测试覆盖率 (低优先级)

## 下一步行动计划

1. 实施方案A修复加密/解密逻辑
2. 更新API文档
3. 创建自动化测试脚本
4. 定期检查系统健康状态

如果您同意这个解决方案，我们可以立即开始实施修复。