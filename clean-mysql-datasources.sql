-- 先禁用大多数测试数据源
UPDATE tbl_data_source 
SET status = 'INACTIVE', active = 0
WHERE id NOT IN ('ds001', 'ds002', 'ds004', 'ba061eae-e180-448a-aeee-2db4d86c6717');

-- 确保所有保留的数据源连接信息正确
-- ds001: 本地MySQL开发数据库
UPDATE tbl_data_source
SET 
    host = 'localhost',
    port = 3306,
    databaseName = 'datascope',
    username = 'root',
    passwordEncrypted = 'datascope',
    passwordSalt = 'datascope',
    status = 'ACTIVE',
    active = 1,
    name = '本地MySQL开发数据库',
    description = '本地开发环境使用的MySQL数据库，包含应用所需的所有表'
WHERE id = 'ds001';

-- ds002: 测试环境MySQL数据库
UPDATE tbl_data_source
SET 
    host = 'localhost',
    port = 3306,
    databaseName = 'datascope',
    username = 'root',
    passwordEncrypted = 'datascope',
    passwordSalt = 'datascope',
    status = 'ACTIVE',
    active = 1,
    name = '测试环境MySQL数据库',
    description = '用于功能测试的MySQL数据库，包含测试数据'
WHERE id = 'ds002';

-- ds004: 生产MySQL数据库（只读）
UPDATE tbl_data_source
SET 
    host = 'localhost',
    port = 3306,
    databaseName = 'datascope',
    username = 'root',
    passwordEncrypted = 'datascope',
    passwordSalt = 'datascope',
    status = 'ACTIVE',
    active = 1,
    name = '生产MySQL数据库（只读）',
    description = '生产环境的只读数据库连接，用于查询实际生产数据'
WHERE id = 'ds004';

-- 员工信息查询表单
UPDATE tbl_data_source
SET 
    host = 'localhost',
    port = 3306,
    databaseName = 'datascope',
    username = 'root',
    passwordEncrypted = 'datascope',
    passwordSalt = 'datascope',
    status = 'ACTIVE',
    active = 1,
    name = '员工信息查询系统',
    description = '用于人力资源部门查询员工信息的专用数据库连接'
WHERE id = 'ba061eae-e180-448a-aeee-2db4d86c6717';

-- 查看结果
SELECT 
    id, 
    name, 
    description,
    host, 
    port, 
    databaseName, 
    username, 
    LEFT(passwordEncrypted, 10) as password_preview,
    status, 
    active, 
    LEFT(lastSyncTime, 19) as lastSync
FROM 
    tbl_data_source
WHERE 
    status = 'ACTIVE';