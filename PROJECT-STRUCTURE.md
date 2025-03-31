# DataScope 项目结构说明

本项目采用模块化组织方式，以下是各目录的主要用途：

## 主要目录

- **webService/**: 后端服务主目录，包含Node.js API服务的完整代码
- **webview-ui/**: 前端界面主目录，包含Vue.js前端应用的完整代码
- **docs/**: 项目文档，包含API设计、使用说明等
  - **docs/node/**: Node.js后端相关文档
  - **docs/project/**: 项目计划和状态报告
- **scripts/**: 工具脚本目录，包含各种维护和测试脚本
- **sql/**: 数据库SQL脚本，包含数据初始化、更新脚本等

## 主要配置文件

- **docker-compose.yml**: Docker服务配置文件，用于本地开发环境
- **README.md**: 项目总体说明文档
- **CHANGELOG.md**: 版本更新日志

## 开发工具脚本

### 数据源管理脚本 (scripts/)

- **encrypt-ds-password.js**: 数据源密码加密工具
- **encrypt-password.js**: 通用密码加密工具
- **test-datasource-connection.js**: 测试数据源连接
- **update-all-passwords.js**: 批量更新数据源密码
- **run-sql-script.js**: SQL脚本执行工具

### 数据库脚本 (sql/)

- **mysql-datasource-init.sql**: 数据源初始化脚本
- **update-datasource-connection.sql**: 更新数据源连接信息
- **update-datasource-password.sql**: 更新数据源密码
- **update-datasource-type.sql**: 统一数据源类型格式
- **clean-mysql-datasources.sql**: 清理测试数据源
- **update-passwords-plaintext.sql**: 开发环境明文密码设置
- **update-passwords-same-salt.sql**: 统一盐值设置

## 开发流程

1. 阅读项目文档(docs/)了解系统架构和API
2. 使用docker-compose启动开发环境
3. 在webService/目录开发后端功能
4. 在webview-ui/目录开发前端界面
5. 使用scripts/目录中的工具进行测试和维护