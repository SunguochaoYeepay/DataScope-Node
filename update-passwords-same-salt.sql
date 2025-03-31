-- 更新所有数据源密码，设置密码和盐值相同，表示明文存储
UPDATE `tbl_data_source` 
SET 
    `passwordEncrypted` = 'datascope',
    `passwordSalt` = 'datascope'
WHERE
    `status` = 'ACTIVE';

-- 查询更新结果
SELECT 
    id, 
    name, 
    type, 
    host, 
    port, 
    databaseName, 
    username, 
    LEFT(passwordEncrypted, 20) as password_preview, 
    LEFT(passwordSalt, 20) as salt_preview,
    status, 
    active,
    lastSyncTime
FROM 
    `tbl_data_source`
WHERE 
    `status` = 'ACTIVE';