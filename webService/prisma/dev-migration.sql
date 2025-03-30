-- DataScope初始数据库结构
-- 创建主要表

-- 数据源表
CREATE TABLE IF NOT EXISTS `tbl_data_source` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `type` VARCHAR(50) NOT NULL,
  `host` VARCHAR(255) NOT NULL,
  `port` INT NOT NULL,
  `databaseName` VARCHAR(255) NOT NULL,
  `username` VARCHAR(255) NOT NULL,
  `passwordEncrypted` VARCHAR(1000) NOT NULL,
  `passwordSalt` VARCHAR(255) NOT NULL,
  `connectionParams` JSON NULL,
  `status` VARCHAR(50) NOT NULL,
  `syncFrequency` VARCHAR(50) NULL,
  `lastSyncTime` DATETIME NULL,
  `nonce` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL,
  `createdBy` VARCHAR(100) NOT NULL DEFAULT 'system',
  `updatedBy` VARCHAR(100) NOT NULL DEFAULT 'system',
  `active` BOOLEAN NOT NULL DEFAULT true,
  PRIMARY KEY (`id`)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 数据库模式表
CREATE TABLE IF NOT EXISTS `tbl_schema` (
  `id` VARCHAR(36) NOT NULL,
  `dataSourceId` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `nonce` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL,
  `createdBy` VARCHAR(100) NOT NULL DEFAULT 'system',
  `updatedBy` VARCHAR(100) NOT NULL DEFAULT 'system',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`dataSourceId`) REFERENCES `tbl_data_source`(`id`) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 表元数据
CREATE TABLE IF NOT EXISTS `tbl_table` (
  `id` VARCHAR(36) NOT NULL,
  `schemaId` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `type` VARCHAR(50) NOT NULL DEFAULT 'TABLE',
  `nonce` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL,
  `createdBy` VARCHAR(100) NOT NULL DEFAULT 'system',
  `updatedBy` VARCHAR(100) NOT NULL DEFAULT 'system',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`schemaId`) REFERENCES `tbl_schema`(`id`) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 列元数据
CREATE TABLE IF NOT EXISTS `tbl_column` (
  `id` VARCHAR(36) NOT NULL,
  `tableId` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `dataType` VARCHAR(100) NOT NULL,
  `length` INT NULL,
  `precision` INT NULL,
  `scale` INT NULL,
  `nullable` BOOLEAN NOT NULL DEFAULT true,
  `isPrimaryKey` BOOLEAN NOT NULL DEFAULT false,
  `isForeignKey` BOOLEAN NOT NULL DEFAULT false,
  `defaultValue` VARCHAR(255) NULL,
  `description` TEXT NULL,
  `nonce` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL,
  `createdBy` VARCHAR(100) NOT NULL DEFAULT 'system',
  `updatedBy` VARCHAR(100) NOT NULL DEFAULT 'system',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`tableId`) REFERENCES `tbl_table`(`id`) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 表关系
CREATE TABLE IF NOT EXISTS `tbl_table_relationship` (
  `id` VARCHAR(36) NOT NULL,
  `sourceTableId` VARCHAR(36) NOT NULL,
  `targetTableId` VARCHAR(36) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `confidence` FLOAT NOT NULL DEFAULT 1.0,
  `isAutoDetected` BOOLEAN NOT NULL DEFAULT false,
  `nonce` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL,
  `createdBy` VARCHAR(100) NOT NULL DEFAULT 'system',
  `updatedBy` VARCHAR(100) NOT NULL DEFAULT 'system',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`sourceTableId`) REFERENCES `tbl_table`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`targetTableId`) REFERENCES `tbl_table`(`id`) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 列关系
CREATE TABLE IF NOT EXISTS `tbl_column_relationship` (
  `id` VARCHAR(36) NOT NULL,
  `tableRelationshipId` VARCHAR(36) NOT NULL,
  `sourceColumnId` VARCHAR(36) NOT NULL,
  `targetColumnId` VARCHAR(36) NOT NULL,
  `nonce` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL,
  `createdBy` VARCHAR(100) NOT NULL DEFAULT 'system',
  `updatedBy` VARCHAR(100) NOT NULL DEFAULT 'system',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`tableRelationshipId`) REFERENCES `tbl_table_relationship`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`sourceColumnId`) REFERENCES `tbl_column`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`targetColumnId`) REFERENCES `tbl_column`(`id`) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 查询表
CREATE TABLE IF NOT EXISTS `tbl_query` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `dataSourceId` VARCHAR(36) NOT NULL,
  `sqlContent` TEXT NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
  `queryType` VARCHAR(50) NOT NULL DEFAULT 'SQL',
  `isFavorite` BOOLEAN NOT NULL DEFAULT false,
  `executionCount` INT NOT NULL DEFAULT 0,
  `lastExecutedAt` DATETIME NULL,
  `tags` VARCHAR(500) NULL,
  `nonce` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL,
  `createdBy` VARCHAR(100) NOT NULL DEFAULT 'system',
  `updatedBy` VARCHAR(100) NOT NULL DEFAULT 'system',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`dataSourceId`) REFERENCES `tbl_data_source`(`id`) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 查询历史
CREATE TABLE IF NOT EXISTS `tbl_query_history` (
  `id` VARCHAR(36) NOT NULL,
  `queryId` VARCHAR(36) NULL,
  `dataSourceId` VARCHAR(36) NOT NULL,
  `sqlContent` TEXT NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  `startTime` DATETIME NOT NULL,
  `endTime` DATETIME NULL,
  `duration` INT NULL,
  `rowCount` INT NULL,
  `errorMessage` TEXT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` VARCHAR(100) NOT NULL DEFAULT 'system',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`queryId`) REFERENCES `tbl_query`(`id`) ON DELETE SET NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 显示配置
CREATE TABLE IF NOT EXISTS `tbl_display_config` (
  `id` VARCHAR(36) NOT NULL,
  `queryId` VARCHAR(36) NOT NULL,
  `displayType` VARCHAR(50) NOT NULL,
  `chartType` VARCHAR(50) NULL,
  `title` VARCHAR(255) NULL,
  `description` TEXT NULL,
  `config` JSON NOT NULL,
  `isDefault` BOOLEAN NOT NULL DEFAULT false,
  `nonce` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL,
  `createdBy` VARCHAR(100) NOT NULL DEFAULT 'system',
  `updatedBy` VARCHAR(100) NOT NULL DEFAULT 'system',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`queryId`) REFERENCES `tbl_query`(`id`) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 元数据同步历史
CREATE TABLE IF NOT EXISTS `tbl_metadata_sync_history` (
  `id` VARCHAR(36) NOT NULL,
  `dataSourceId` VARCHAR(36) NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  `startTime` DATETIME NOT NULL,
  `endTime` DATETIME NULL,
  `duration` INT NULL,
  `syncType` VARCHAR(50) NOT NULL,
  `tablesCount` INT NULL,
  `viewsCount` INT NULL,
  `relationshipsCount` INT NULL,
  `errorMessage` TEXT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` VARCHAR(100) NOT NULL DEFAULT 'system',
  PRIMARY KEY (`id`)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 查询执行计划
CREATE TABLE IF NOT EXISTS `tbl_query_plan` (
  `id` VARCHAR(36) NOT NULL,
  `queryId` VARCHAR(36) NULL,
  `dataSourceId` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NULL,
  `sql` TEXT NOT NULL,
  `planData` TEXT NOT NULL,
  `estimatedCost` FLOAT NULL,
  `optimizationTips` TEXT NULL,
  `isAnalyzed` BOOLEAN NOT NULL DEFAULT false,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL,
  `createdBy` VARCHAR(100) NOT NULL DEFAULT 'system',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`queryId`) REFERENCES `tbl_query`(`id`) ON DELETE SET NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 保存的查询表
CREATE TABLE IF NOT EXISTS `tbl_saved_query` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `dataSourceId` VARCHAR(36) NOT NULL,
  `sqlContent` TEXT NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL,
  `createdBy` VARCHAR(100) NOT NULL DEFAULT 'system',
  `updatedBy` VARCHAR(100) NOT NULL DEFAULT 'system',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`dataSourceId`) REFERENCES `tbl_data_source`(`id`) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 插入测试数据
INSERT INTO `tbl_data_source` 
(`id`, `name`, `description`, `type`, `host`, `port`, `databaseName`, `username`, `passwordEncrypted`, `passwordSalt`, `status`, `active`, `updatedAt`)
VALUES 
('test-ds-1', 'Local MySQL', 'Local MySQL database for testing', 'mysql', '127.0.0.1', 3306, 'datascope', 'root', 'encrypted:datascope', 'salt', 'ACTIVE', true, NOW());