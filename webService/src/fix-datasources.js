const mysql = require('mysql2/promise');

async function fixDataSources() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'tZ_,;qP1?CtV',
      database: 'datascope'
    });
    
    console.log('数据库连接成功!');
    
    // 激活所有数据源
    const updateSql = `UPDATE tbl_data_source SET active = 1 WHERE status = 'ACTIVE'`;
    
    console.log('执行SQL:', updateSql);
    console.log('更新数据源...');
    
    const [result] = await connection.execute(updateSql);
    console.log(`成功激活 ${result.affectedRows} 个数据源!`);
    
    // 查询验证
    const [sources] = await connection.execute('SELECT id, name, type, host, port, databaseName, status, active FROM tbl_data_source');
    console.log('数据源列表:', JSON.stringify(sources, null, 2));
    
    await connection.end();
  } catch (error) {
    console.error('修复数据源失败:', error);
  }
}

fixDataSources(); 