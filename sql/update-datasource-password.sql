-- 更新数据源密码
-- 使用正确的加密密码和盐值

-- 本地MySQL开发数据库
UPDATE `tbl_data_source` 
SET 
  `passwordEncrypted` = '313635a796bbf4fb265b98822b2cd0a2b8e89c410ca0a4bc3a89d46e5a6093dd',
  `passwordSalt` = '95abc3504882021b500a5582b85cc6d5'
WHERE `id` = 'ds001';

-- Docker MySQL测试数据库
UPDATE `tbl_data_source` 
SET 
  `passwordEncrypted` = '1620aa7913661cd88efab97dad8baa5fefec1590e76c76c53f687ae66cd94b50',
  `passwordSalt` = '7593ada2d66c30ce9a9e022b71d67702'
WHERE `id` = 'ds002';

-- 测试PostgreSQL数据库
UPDATE `tbl_data_source` 
SET 
  `passwordEncrypted` = '7eb45e33adff64288e84708fbba8740e3d10b31470475e9bebb72973f1318aad',
  `passwordSalt` = 'a4731dafe9b25007db6b124f5146ff55'
WHERE `id` = 'ds003';

-- 生产MySQL数据库（只读账户）
UPDATE `tbl_data_source` 
SET 
  `passwordEncrypted` = '9b0d9560799ca687065e41db4869c977651779dcd856019fa7eb2ece37e3f6a9',
  `passwordSalt` = '8a91b891e2e9a2732c51e88b821363bc'
WHERE `id` = 'ds004';