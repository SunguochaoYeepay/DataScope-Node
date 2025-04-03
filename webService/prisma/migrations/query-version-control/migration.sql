-- 查询服务版本控制与状态管理 - 数据库结构变更脚本
-- 创建日期: 2023-05-30

-- 1. 在查询服务主表(tbl_query)中添加状态相关字段
ALTER TABLE `tbl_query` ADD COLUMN `service_status` ENUM('ENABLED', 'DISABLED') NOT NULL DEFAULT 'ENABLED' AFTER `status`;
ALTER TABLE `tbl_query` ADD COLUMN `current_version_id` VARCHAR(36) NULL AFTER `sqlContent`;
ALTER TABLE `tbl_query` ADD COLUMN `versions_count` INT NOT NULL DEFAULT 0 AFTER `current_version_id`;
ALTER TABLE `tbl_query` ADD COLUMN `disabled_reason` TEXT NULL AFTER `versions_count`;
ALTER TABLE `tbl_query` ADD COLUMN `disabled_at` DATETIME NULL AFTER `disabled_reason`;

-- 2. 创建查询版本表(tbl_query_version)
CREATE TABLE `tbl_query_version` (
  `id` VARCHAR(36) NOT NULL,
  `query_id` VARCHAR(36) NOT NULL,
  `version_number` INT NOT NULL,
  `version_status` ENUM('DRAFT', 'PUBLISHED', 'DEPRECATED') NOT NULL DEFAULT 'DRAFT',
  `sql_content` TEXT NOT NULL,
  `data_source_id` VARCHAR(36) NOT NULL,
  `parameters` JSON NULL,
  `description` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `published_at` DATETIME NULL,
  `deprecated_at` DATETIME NULL,
  `created_by` VARCHAR(255) NOT NULL DEFAULT 'system',
  PRIMARY KEY (`id`),
  INDEX `idx_query_versions_query_id` (`query_id`),
  INDEX `idx_query_versions_status` (`version_status`),
  INDEX `idx_query_versions_created_at` (`created_at`),
  CONSTRAINT `fk_query_version_query_id` FOREIGN KEY (`query_id`) REFERENCES `tbl_query` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_query_version_data_source_id` FOREIGN KEY (`data_source_id`) REFERENCES `tbl_data_source` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. 在查询历史表(tbl_query_history)中添加版本相关字段
ALTER TABLE `tbl_query_history` ADD COLUMN `version_id` VARCHAR(36) NULL AFTER `queryId`;
ALTER TABLE `tbl_query_history` ADD COLUMN `version_number` INT NULL AFTER `version_id`;
ALTER TABLE `tbl_query_history` ADD COLUMN `execution_time_ms` INT NULL AFTER `duration`;
ALTER TABLE `tbl_query_history` ADD COLUMN `row_count` INT NULL AFTER `execution_time_ms`;

-- 4. 添加查询历史表索引
CREATE INDEX `idx_query_history_query_id` ON `tbl_query_history`(`queryId`);
CREATE INDEX `idx_query_history_version_id` ON `tbl_query_history`(`version_id`);

-- 5. 数据迁移: 为现有查询创建v1版本
INSERT INTO `tbl_query_version` (
  `id`,
  `query_id`,
  `version_number`,
  `version_status`,
  `sql_content`,
  `data_source_id`,
  `created_at`,
  `published_at`,
  `created_by`
)
SELECT 
  UUID(),
  `id`,
  1,
  'PUBLISHED',
  `sqlContent`,
  `dataSourceId`,
  `createdAt`,
  `createdAt`,
  `createdBy`
FROM 
  `tbl_query`;

-- 6. 更新查询服务主表current_version_id字段
UPDATE `tbl_query` q
JOIN `tbl_query_version` qv ON q.id = qv.query_id
SET q.current_version_id = qv.id, q.versions_count = 1
WHERE qv.version_number = 1;