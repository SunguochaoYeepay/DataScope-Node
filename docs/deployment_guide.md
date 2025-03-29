# DataScope 部署指南

## 系统要求

### 硬件要求
- CPU: 4核心及以上
- 内存: 8GB及以上
- 磁盘: 100GB及以上
- 网络: 千兆网卡

### 软件要求
- JDK 17+
- MySQL 8.0+
- Redis 6.0+
- Maven 3.8+
- Docker 20.10+
- Docker Compose 2.0+

## 环境准备

### 数据库配置
1. 创建数据库
```sql
CREATE DATABASE data_scope DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

2. 创建用户并授权
```sql
CREATE USER 'datascope'@'%' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON data_scope.* TO 'datascope'@'%';
FLUSH PRIVILEGES;
```

### Redis配置
1. 修改redis.conf
```conf
bind 0.0.0.0
protected-mode yes
port 6379
requirepass your_password
```

2. 启动Redis服务
```bash
redis-server /path/to/redis.conf
```

## 应用部署

### Docker部署

1. 构建镜像
```bash
# 在项目根目录执行
mvn clean package
docker build -t datascope:latest .
```

2. 准备docker-compose.yml
```yaml
version: '3'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: data_scope
      MYSQL_USER: datascope
      MYSQL_PASSWORD: your_password
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

  redis:
    image: redis:6.0
    command: redis-server --requirepass your_password
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

  datascope:
    image: datascope:latest
    environment:
      SPRING_PROFILES_ACTIVE: prod
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/data_scope
      SPRING_DATASOURCE_USERNAME: datascope
      SPRING_DATASOURCE_PASSWORD: your_password
      SPRING_REDIS_HOST: redis
      SPRING_REDIS_PASSWORD: your_password
    ports:
      - "8080:8080"
    depends_on:
      - mysql
      - redis

volumes:
  mysql_data:
  redis_data:
```

3. 启动服务
```bash
docker-compose up -d
```

### 手动部署

1. 编译打包
```bash
mvn clean package
```

2. 准备配置文件
```bash
cp application.yml application-prod.yml
```

3. 修改生产配置
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/data_scope
    username: datascope
    password: your_password
  redis:
    host: localhost
    port: 6379
    password: your_password

logging:
  file:
    path: /var/log/datascope
```

4. 启动应用
```bash
java -jar \
  -Xms4g -Xmx4g \
  -XX:+UseG1GC \
  -XX:MaxGCPauseMillis=200 \
  -Dspring.profiles.active=prod \
  data-scope-main.jar
```

## 监控配置

### Prometheus配置
```yaml
scrape_configs:
  - job_name: 'datascope'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['localhost:8080']
```

### Grafana配置
1. 导入仪表板
2. 配置数据源
3. 设置告警规则

## 日志管理

### 日志配置
```yaml
logging:
  file:
    path: /var/log/datascope
    name: ${logging.file.path}/application.log
  pattern:
    file: "%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n"
  logback:
    rollingpolicy:
      max-file-size: 100MB
      max-history: 30
```

### 日志收集
使用ELK Stack或其他日志收集系统

## 备份策略

### 数据库备份
1. 创建备份脚本
```bash
#!/bin/bash
BACKUP_DIR="/backup/mysql"
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u datascope -p data_scope > $BACKUP_DIR/data_scope_$DATE.sql
```

2. 配置定时任务
```bash
0 2 * * * /path/to/backup.sh
```

### 配置备份
定期备份配置文件和其他重要文件

## 安全配置

### 防火墙配置
```bash
# 开放必要端口
firewall-cmd --permanent --add-port=8080/tcp
firewall-cmd --permanent --add-port=3306/tcp
firewall-cmd --permanent --add-port=6379/tcp
firewall-cmd --reload
```

### SSL配置
```yaml
server:
  ssl:
    key-store: classpath:keystore.p12
    key-store-password: your_password
    key-store-type: PKCS12
    key-alias: datascope
```

## 运维操作

### 启动服务
```bash
systemctl start datascope
```

### 停止服务
```bash
systemctl stop datascope
```

### 查看日志
```bash
tail -f /var/log/datascope/application.log
```

### 性能监控
```bash
# CPU和内存使用
top -p $(pgrep -f datascope)

# JVM监控
jstat -gcutil $(pgrep -f datascope) 1000
```

## 故障处理

### 常见问题
1. 数据库连接失败
   - 检查数据库服务状态
   - 验证连接信息
   - 检查网络连接

2. Redis连接失败
   - 检查Redis服务状态
   - 验证密码配置
   - 检查内存使用

3. 应用启动失败
   - 检查配置文件
   - 查看错误日志
   - 验证端口占用

### 性能优化
1. JVM调优
   - 调整堆大小
   - 选择合适的GC
   - 监控GC日志

2. 数据库优化
   - 优化索引
   - 调整连接池
   - 监控慢查询

3. 缓存优化
   - 调整缓存策略
   - 监控命中率
   - 及时清理
