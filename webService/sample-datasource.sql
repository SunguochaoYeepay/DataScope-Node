-- 插入示例数据源
INSERT INTO tbl_data_source 
(id, name, description, type, host, port, databaseName, username, passwordEncrypted, passwordSalt, status, syncFrequency, nonce, createdAt, updatedAt, createdBy, updatedBy, active)
VALUES
(UUID(), 'MySQL样例', '本地MySQL测试数据源', 'MYSQL', 'localhost', 3306, 'datascope', 'root', '加密的密码', '盐值', 'ACTIVE', 'MANUAL', 0, NOW(), NOW(), 'system', 'system', 1),
(UUID(), 'PostgreSQL样例', 'PostgreSQL测试数据源', 'POSTGRESQL', 'localhost', 5432, 'postgres', 'postgres', '加密的密码', '盐值', 'ACTIVE', 'MANUAL', 0, NOW(), NOW(), 'system', 'system', 1),
(UUID(), 'SQLite样例', 'SQLite示例数据库', 'SQLITE', 'localhost', 0, '/tmp/test.db', '', '加密的密码', '盐值', 'ACTIVE', 'MANUAL', 0, NOW(), NOW(), 'system', 'system', 1); 