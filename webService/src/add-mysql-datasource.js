const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

// 简单的加密函数，与服务中的应该兼容
function encrypt(text) {
  const salt = crypto.randomBytes(16).toString('hex');
  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'your_encryption_key_32chars_long', salt, 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return {
    encrypted: `${encrypted}:${iv.toString('hex')}`,
    salt
  };
}

async function addMySQLDataSource() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'tZ_,;qP1?CtV',
      database: 'datascope'
    });
    
    console.log('数据库连接成功!');
    
    // 加密密码
    const password = "tZ_,;qP1?CtV"; // 使用真实密码
    const { encrypted, salt } = encrypt(password);
    
    // 准备纯MySQL数据源
    const dataSource = {
      id: uuidv4(),
      name: "本地MySQL(可连接)",
      description: "本地MySQL数据库，可以成功连接",
      type: "mysql",
      host: "localhost",
      port: 3306,
      databaseName: "datascope",  // 使用现有数据库
      username: "root",
      passwordEncrypted: encrypted,
      passwordSalt: salt,
      connectionParams: JSON.stringify({
        ssl: false,
        timeout: 10000
      }),
      status: "ACTIVE",
      syncFrequency: "DAILY",
      lastSyncTime: null,
      nonce: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "system",
      updatedBy: "system",
      active: true
    };
    
    // 构建插入SQL
    const fields = Object.keys(dataSource).join(', ');
    const placeholders = Object.keys(dataSource).map(() => '?').join(', ');
    const values = Object.values(dataSource);
    
    const sql = `INSERT INTO tbl_data_source (${fields}) VALUES (${placeholders})`;
    
    console.log('执行SQL:', sql);
    console.log('插入数据源...');
    
    const [result] = await connection.execute(sql, values);
    console.log('数据源添加成功!', result);
    
    // 查询验证
    const [sources] = await connection.execute('SELECT id, name, type, host, port, databaseName, status, active FROM tbl_data_source');
    console.log('数据源列表:', JSON.stringify(sources, null, 2));
    
    await connection.end();
  } catch (error) {
    console.error('添加MySQL数据源失败:', error);
  }
}

addMySQLDataSource(); 