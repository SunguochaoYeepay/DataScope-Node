-- 更新数据源类型，确保格式一致
-- 根据代码检查，前端期望大写类型，后端期望小写类型

-- 更新数据源类型为小写
UPDATE `tbl_data_source` 
SET `type` = 'mysql'
WHERE `id` = 'ds001';

UPDATE `tbl_data_source` 
SET `type` = 'mysql'
WHERE `id` = 'ds002';

UPDATE `tbl_data_source` 
SET `type` = 'postgresql'
WHERE `id` = 'ds003';

UPDATE `tbl_data_source` 
SET `type` = 'mysql'
WHERE `id` = 'ds004';

-- 查看更新后的数据源信息
SELECT id, name, type, host, port, databaseName, status, active, lastSyncTime 
FROM tbl_data_source 
WHERE id IN ('ds001', 'ds002', 'ds003', 'ds004');