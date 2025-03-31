/**
 * 直接导入数据库数据的脚本
 * 使用MySQL命令行
 */
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// 数据库连接信息
const config = {
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'datascope',
  database: 'datascope'
};

// SQL文件路径
const sqlFilePath = path.join(__dirname, 'mysql-datasource-init.sql');

// 构建MySQL导入命令
const command = `mysql -h${config.host} -P${config.port} -u${config.user} -p${config.password} ${config.database} < ${sqlFilePath}`;

console.log('正在执行SQL导入命令...');
console.log(command);

// 执行命令
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`执行错误: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`错误输出: ${stderr}`);
    return;
  }
  
  console.log('SQL导入成功完成!');
  console.log(stdout);
});