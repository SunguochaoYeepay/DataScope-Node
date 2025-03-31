-- 更新所有数据源密码为明文存储（只用于开发环境！）
-- 这将使密码等于"datascope"，但存储时与解密结果相同

UPDATE `tbl_data_source` 
SET 
  `passwordEncrypted` = 'datascope',
  `passwordSalt` = 'datascope'
WHERE `active` = 1;

-- 查询更新后的结果
SELECT id, name, username, passwordEncrypted, passwordSalt
FROM tbl_data_source
WHERE active = 1;