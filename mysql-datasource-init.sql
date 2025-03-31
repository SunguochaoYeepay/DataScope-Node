-- 初始化数据源连接脚本
-- 创建几个真实的数据源连接配置

-- 本地MySQL开发数据库
INSERT INTO `tbl_data_source` 
(`id`, `name`, `description`, `type`, `host`, `port`, `databaseName`, `username`, 
 `passwordEncrypted`, `passwordSalt`, `status`, `active`, `updatedAt`, `createdAt`, `syncFrequency`, `lastSyncTime`)
VALUES 
('ds001', '本地MySQL开发数据库', '用于本地开发的MySQL数据库连接', 'mysql', 'localhost', 3306, 
 'dev_database', 'root', '139ee764b5cc82db37793846271a7ddf:3622d763659980786bcc9980d819daa0', 
 '97ef27b74abd7f05f381e639c6523f72', 'ACTIVE', 1, NOW(), NOW(), '60', NULL);

-- Docker MySQL测试数据库
INSERT INTO `tbl_data_source` 
(`id`, `name`, `description`, `type`, `host`, `port`, `databaseName`, `username`, 
 `passwordEncrypted`, `passwordSalt`, `status`, `active`, `updatedAt`, `createdAt`, `syncFrequency`, `lastSyncTime`)
VALUES 
('ds002', 'Docker MySQL测试数据库', 'Docker容器中运行的MySQL测试数据库', 'mysql', 'mysql.docker.local', 3306, 
 'test_database', 'datascope', '4eaf7b7dcae74adf98c185e31bbf2ddc:e6b95a39835adc070f58acd253d7ac49', 
 'aebf59a2600993ef538a06866b3d9ef7', 'ACTIVE', 1, NOW(), NOW(), '120', NULL);

-- 测试PostgreSQL数据库
INSERT INTO `tbl_data_source` 
(`id`, `name`, `description`, `type`, `host`, `port`, `databaseName`, `username`, 
 `passwordEncrypted`, `passwordSalt`, `status`, `active`, `updatedAt`, `createdAt`, `syncFrequency`, `lastSyncTime`)
VALUES 
('ds003', '测试PostgreSQL数据库', 'PostgreSQL测试服务器', 'postgresql', 'postgres.test.server', 5432, 
 'analytics', 'postgres', 'd5d4289c45bd875aba15a98383c72cff:0496ac43ebce39ce2f8e1e3e0623b11b', 
 '5c2440fe83e95c6df2d949c71d5bda43', 'ACTIVE', 1, NOW(), NOW(), '240', NULL);

-- 生产MySQL数据库（只读账户）
INSERT INTO `tbl_data_source` 
(`id`, `name`, `description`, `type`, `host`, `port`, `databaseName`, `username`, 
 `passwordEncrypted`, `passwordSalt`, `status`, `active`, `updatedAt`, `createdAt`, `syncFrequency`, `lastSyncTime`)
VALUES 
('ds004', '生产MySQL数据库（只读）', '生产环境MySQL数据库只读连接', 'mysql', 'db.production.example.com', 3306, 
 'prod_database', 'readonly', 'ed3fe8577291b81c48782f6dc3614f0a:62de1a157b6dc4c854ba7e7bc4ffcc04', 
 '48bf4dc477128ccc89d966c8e0e2e9d6', 'ACTIVE', 1, NOW(), NOW(), '360', NULL);