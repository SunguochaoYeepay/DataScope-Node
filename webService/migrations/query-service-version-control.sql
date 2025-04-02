-- 查询服务版本控制与状态管理 - 数据库结构变更脚本
-- 创建日期: 2023-05-30

-- 1. 备份现有表(在执行结构变更前应先执行备份)
CREATE TABLE queries_backup AS SELECT * FROM queries;
CREATE TABLE query_history_backup AS SELECT * FROM query_history;

-- 2. 查询服务主表(queries)增加状态相关字段
ALTER TABLE queries ADD COLUMN status ENUM('ENABLED', 'DISABLED') NOT NULL DEFAULT 'ENABLED';
ALTER TABLE queries ADD COLUMN current_version_id VARCHAR(36) NULL;
ALTER TABLE queries ADD COLUMN versions_count INT NOT NULL DEFAULT 0;
ALTER TABLE queries ADD COLUMN disabled_reason TEXT NULL;
ALTER TABLE queries ADD COLUMN disabled_at TIMESTAMP NULL;

-- 3. 创建查询版本表(query_versions)
CREATE TABLE query_versions (
  id VARCHAR(36) PRIMARY KEY,
  query_id VARCHAR(36) NOT NULL,
  version_number INT NOT NULL,
  version_status ENUM('DRAFT', 'PUBLISHED', 'DEPRECATED') NOT NULL DEFAULT 'DRAFT',
  sql_content TEXT NOT NULL,
  data_source_id VARCHAR(36) NOT NULL,
  parameters JSON NULL,
  description TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP NULL,
  deprecated_at TIMESTAMP NULL,
  FOREIGN KEY (query_id) REFERENCES queries(id) ON DELETE CASCADE,
  FOREIGN KEY (data_source_id) REFERENCES datasources(id)
);

-- 4. 添加版本表索引
CREATE INDEX idx_query_versions_query_id ON query_versions(query_id);
CREATE INDEX idx_query_versions_status ON query_versions(version_status);
CREATE INDEX idx_query_versions_created_at ON query_versions(created_at);

-- 5. 查询历史表(query_history)优化
ALTER TABLE query_history ADD COLUMN query_id VARCHAR(36) NULL;
ALTER TABLE query_history ADD COLUMN version_id VARCHAR(36) NULL;
ALTER TABLE query_history ADD COLUMN version_number INT NULL;
ALTER TABLE query_history ADD COLUMN execution_time_ms INT NULL;
ALTER TABLE query_history ADD COLUMN row_count INT NULL;

-- 6. 添加历史表索引
CREATE INDEX idx_query_history_query_id ON query_history(query_id);
CREATE INDEX idx_query_history_version_id ON query_history(version_id);

-- 7. 数据迁移: 为现有查询创建v1版本
INSERT INTO query_versions (
  id, 
  query_id, 
  version_number, 
  version_status, 
  sql_content, 
  data_source_id, 
  created_at, 
  published_at
)
SELECT 
  UUID(), 
  id, 
  1, 
  'PUBLISHED', 
  sql_content, 
  data_source_id, 
  created_at, 
  created_at
FROM 
  queries;

-- 8. 更新查询服务主表current_version_id字段
UPDATE queries q
JOIN query_versions qv ON q.id = qv.query_id
SET q.current_version_id = qv.id, q.versions_count = 1
WHERE qv.version_number = 1;

-- 9. 数据一致性验证查询
-- 执行此查询检查是否所有查询都有对应的版本记录
-- SELECT q.id, q.name, q.current_version_id 
-- FROM queries q
-- LEFT JOIN query_versions qv ON q.id = qv.query_id
-- WHERE qv.id IS NULL;

-- 10. 回滚脚本(需要时使用)
/*
DROP TABLE IF EXISTS query_versions;
ALTER TABLE queries DROP COLUMN status;
ALTER TABLE queries DROP COLUMN current_version_id;
ALTER TABLE queries DROP COLUMN versions_count;
ALTER TABLE queries DROP COLUMN disabled_reason;
ALTER TABLE queries DROP COLUMN disabled_at;
ALTER TABLE query_history DROP COLUMN query_id;
ALTER TABLE query_history DROP COLUMN version_id;
ALTER TABLE query_history DROP COLUMN version_number;
ALTER TABLE query_history DROP COLUMN execution_time_ms;
ALTER TABLE query_history DROP COLUMN row_count;
*/