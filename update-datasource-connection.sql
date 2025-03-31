-- 更新数据源连接信息，使用正确的本地连接

-- 本地MySQL开发数据库 - 使用本地datascope数据库
UPDATE `tbl_data_source` 
SET 
  `databaseName` = 'datascope'
WHERE `id` = 'ds001';

-- 查看所有数据源状态
SELECT id, name, host, port, databaseName, username, status, active, lastSyncTime 
FROM tbl_data_source;