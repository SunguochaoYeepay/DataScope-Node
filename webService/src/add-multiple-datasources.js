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

// 定义多个示例数据源
const sampleDataSources = [
  {
    name: "开发环境MySQL",
    description: "本地开发环境MySQL数据库",
    type: "mysql",
    host: "localhost",
    port: 3306,
    databaseName: "dev_db",
    username: "dev_user",
    status: "ACTIVE"
  },
  {
    name: "测试环境PostgreSQL",
    description: "测试服务器PostgreSQL数据库",
    type: "postgresql",
    host: "test-db.example.com",
    port: 5432,
    databaseName: "test_db",
    username: "test_user",
    status: "ACTIVE"
  },
  {
    name: "生产Oracle数据库",
    description: "生产环境Oracle数据仓库",
    type: "oracle",
    host: "oracle-prod.internal",
    port: 1521,
    databaseName: "PRODDB",
    username: "app_user",
    status: "ACTIVE"
  },
  {
    name: "Snowflake数据仓库",
    description: "企业数据分析仓库",
    type: "snowflake",
    host: "org-account.snowflakecomputing.com",
    port: 443,
    databaseName: "ANALYTICS",
    username: "analyst",
    status: "ACTIVE"
  },
  {
    name: "历史数据库(已禁用)",
    description: "历史数据归档库，仅供查阅",
    type: "mysql",
    host: "archive-db.example.com",
    port: 3306,
    databaseName: "archive_2022",
    username: "reader",
    status: "INACTIVE"
  }
];

async function addSampleDataSources() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'tZ_,;qP1?CtV',
      database: 'datascope'
    });
    
    console.log('数据库连接成功!');
    
    // 依次添加每个示例数据源
    for (const sourceDef of sampleDataSources) {
      // 加密密码
      const password = "password123";
      const { encrypted, salt } = encrypt(password);
      
      // 准备完整数据
      const dataSource = {
        id: uuidv4(),
        name: sourceDef.name,
        description: sourceDef.description,
        type: sourceDef.type,
        host: sourceDef.host,
        port: sourceDef.port,
        databaseName: sourceDef.databaseName,
        username: sourceDef.username,
        passwordEncrypted: encrypted,
        passwordSalt: salt,
        connectionParams: JSON.stringify({
          ssl: sourceDef.type === 'snowflake',
          timeout: 10000
        }),
        status: sourceDef.status,
        syncFrequency: "DAILY",
        lastSyncTime: null,
        nonce: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "system",
        updatedBy: "system",
        active: sourceDef.status === "ACTIVE"
      };
      
      // 构建插入SQL
      const fields = Object.keys(dataSource).join(', ');
      const placeholders = Object.keys(dataSource).map(() => '?').join(', ');
      const values = Object.values(dataSource);
      
      const sql = `INSERT INTO tbl_data_source (${fields}) VALUES (${placeholders})`;
      
      console.log(`添加数据源: ${sourceDef.name}`);
      
      const [result] = await connection.execute(sql, values);
      console.log(`数据源 "${sourceDef.name}" 添加成功!`);
    }
    
    // 查询验证
    const [sources] = await connection.execute('SELECT id, name, type, host, port, databaseName, status, active FROM tbl_data_source');
    console.log('数据源列表:', JSON.stringify(sources, null, 2));
    console.log(`共添加 ${sampleDataSources.length} 个示例数据源`);
    
    await connection.end();
  } catch (error) {
    console.error('添加示例数据源失败:', error);
  }
}

addSampleDataSources(); 