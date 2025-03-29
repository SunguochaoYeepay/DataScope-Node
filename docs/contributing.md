# DataScope 贡献指南

## 开发流程

### 分支管理
```text
main        # 主分支，稳定版本
develop     # 开发分支，最新开发版本
feature/*   # 功能分支，如 feature/add-mysql-support
bugfix/*    # 问题修复分支
release/*   # 发布分支，如 release/v1.0.0
hotfix/*    # 紧急修复分支
```

### 开发流程
1. 从develop分支创建功能分支
2. 在功能分支上开发
3. 提交Pull Request到develop分支
4. 代码评审
5. 合并到develop分支
6. 定期从develop分支合并到main分支发布

## 提交规范

### 提交信息格式
```text
<type>(<scope>): <subject>

<body>

<footer>
```

### 类型说明
```text
feat:     新功能
fix:      修复问题
docs:     文档更新
style:    代码格式（不影响代码运行的变动）
refactor: 重构（既不是新增功能，也不是修改bug的代码变动）
test:     增加测试
chore:    构建过程或辅助工具的变动
```

### 示例
```text
feat(datasource): 添加MySQL数据源支持

- 实现MySQL连接配置
- 添加MySQL元数据提取
- 支持MySQL查询执行

Closes #123
```

## 代码规范

### Java代码规范
```java
// 1. 类名使用大驼峰命名
public class DataSourceService {
    // 2. 常量使用大写字母，单词间用下划线分隔
    private static final String DEFAULT_HOST = "localhost";
    
    // 3. 变量使用小驼峰命名
    private String dataSourceName;
    
    // 4. 方法使用小驼峰命名
    public void connectToDatabase() {
        // 5. 代码块使用4个空格缩进
        if (isConnected) {
            return;
        }
    }
}
```

### 注释规范
```java
/**
 * 类级别注释
 * 
 * @author 作者名
 */
public class Example {
    /**
     * 方法级别注释
     * 
     * @param param 参数说明
     * @return 返回值说明
     * @throws Exception 异常说明
     */
    public String method(String param) {
        // 单行注释
        return param;
    }
}
```

## Pull Request流程

### PR模板
```markdown
## 描述
简要描述你的改动

## 类型
- [ ] 新功能
- [ ] Bug修复
- [ ] 性能优化
- [ ] 代码重构
- [ ] 文档更新
- [ ] 其他

## 关联Issue
Fixes #123

## 测试
- [ ] 单元测试
- [ ] 集成测试
- [ ] 性能测试

## 检查清单
- [ ] 代码符合规范
- [ ] 添加了必要的测试
- [ ] 更新了相关文档
- [ ] 本地测试通过
```

### 评审流程
1. 提交PR
2. 等待CI检查
3. 代码评审
4. 解决评审意见
5. 合并代码

## 测试要求

### 单元测试
```java
@Test
void shouldCreateDataSource() {
    // Given
    DataSource dataSource = createTestDataSource();
    
    // When
    DataSource result = service.create(dataSource);
    
    // Then
    assertNotNull(result);
    assertEquals(dataSource.getName(), result.getName());
}
```

### 集成测试
```java
@SpringBootTest
class DataSourceIntegrationTest {
    @Test
    void shouldConnectToDatabase() {
        // Given
        DataSource dataSource = createTestDataSource();
        
        // When
        boolean connected = service.testConnection(dataSource);
        
        // Then
        assertTrue(connected);
    }
}
```

## 文档要求

### 代码文档
- 类级别注释
- 公共方法注释
- 复杂逻辑说明
- 配置说明

### 技术文档
- 架构设计
- API文档
- 部署文档
- 运维文档

## 问题反馈

### Issue模板
```markdown
## 问题描述
清晰描述你遇到的问题

## 复现步骤
1. 第一步
2. 第二步
3. 问题出现

## 期望行为
描述期望的正确行为

## 实际行为
描述实际的错误行为

## 环境信息
- 操作系统：
- Java版本：
- 数据库版本：
- 项目版本：

## 其他信息
补充其他相关信息
```

### 问题跟踪
1. 创建Issue
2. 指派负责人
3. 问题分析
4. 提交修复
5. 验证关闭

## 发布流程

### 版本号规则
```text
v{major}.{minor}.{patch}
例如：v1.0.0, v1.1.0, v1.0.1

major: 重大更新
minor: 功能更新
patch: 问题修复
```

### 发布步骤
1. 创建发布分支
2. 更新版本号
3. 更新文档
4. 执行测试
5. 生成发布包
6. 发布公告

## 社区规范

### 行为准则
1. 尊重他人
2. 积极贡献
3. 遵守规范
4. 及时响应
5. 乐于分享

### 交流方式
- GitHub Issues
- Pull Requests
- 技术讨论组
- 邮件列表
- 在线会议