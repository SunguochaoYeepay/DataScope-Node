const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    // 明文密码：tZ_,;qP1?CtV
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'tZ_,;qP1?CtV',
      database: 'datascope'
    });
    
    console.log('数据库连接成功!');
    
    // 查询tbl_data_source表的记录数
    const [countResult] = await connection.execute('SELECT COUNT(*) AS count FROM tbl_data_source');
    console.log('数据源表中的记录数:', countResult[0].count);
    
    // 查询数据源详情
    if(countResult[0].count > 0) {
      const [sources] = await connection.execute('SELECT id, name, type, host, port, database_name, status, active FROM tbl_data_source LIMIT 10');
      console.log('数据源列表:', JSON.stringify(sources, null, 2));
    } else {
      console.log('没有数据源记录，需要添加示例数据');
    }
    
    await connection.end();
  } catch (error) {
    console.error('数据库操作失败:', error);
  }
}

testConnection(); 