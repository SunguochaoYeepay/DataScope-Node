-- -------------------------
-- 查询收藏功能 - 初始化脚本
-- -------------------------

-- 确认是否需要创建表
SET @tableExists = (
    SELECT COUNT(*)
    FROM information_schema.tables
    WHERE table_schema = DATABASE()
    AND table_name = 'tbl_query_favorite'
);

-- 如果表不存在，则创建表
SET @createTable = CONCAT('
CREATE TABLE IF NOT EXISTS `tbl_query_favorite` (
  `id` VARCHAR(36) NOT NULL,
  `queryId` VARCHAR(36) NOT NULL,
  `userId` VARCHAR(255) NOT NULL DEFAULT "anonymous",
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  
  PRIMARY KEY (`id`),
  INDEX `idx_query_favorite_query_id` (`queryId`),
  INDEX `idx_query_favorite_user_id` (`userId`),
  INDEX `idx_query_favorite_created_at` (`createdAt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
');

-- 执行表创建
PREPARE stmt FROM @createTable;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 确认是否需要添加 isFavorite 字段到查询表
SET @columnExists = (
    SELECT COUNT(*)
    FROM information_schema.columns
    WHERE table_schema = DATABASE()
    AND table_name = 'tbl_query'
    AND column_name = 'isFavorite'
);

-- 如果字段不存在，则添加字段
SET @addColumn = IF(@columnExists = 0, 
    'ALTER TABLE `tbl_query` ADD COLUMN `isFavorite` BOOLEAN NOT NULL DEFAULT false;',
    'SELECT "isFavorite column already exists in tbl_query table." AS message;'
);

-- 执行字段添加
PREPARE stmt FROM @addColumn;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;