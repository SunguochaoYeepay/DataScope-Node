const { execSync } = require('child_process');

const PORT = process.env.PORT || 5000;

try {
  // 检查端口是否被占用
  const processes = execSync(`lsof -i :${PORT} -t`).toString().trim();
  
  if (processes) {
    console.log(`\x1b[33m警告: 端口 ${PORT} 已被以下进程占用:\x1b[0m`);
    const processDetails = execSync(`ps -p ${processes} -o pid,user,command`).toString();
    console.log(processDetails);
    
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readline.question(`\x1b[36m是否终止这些进程? (y/n) \x1b[0m`, (answer) => {
      if (answer.toLowerCase() === 'y') {
        try {
          execSync(`kill ${processes}`);
          console.log(`\x1b[32m✓ 进程已终止，端口 ${PORT} 现在可用\x1b[0m`);
        } catch (err) {
          console.log(`\x1b[31m无法终止进程，请使用管理员权限尝试\x1b[0m`);
          process.exit(1);
        }
      } else {
        console.log(`\x1b[33m请选择其他端口或手动终止这些进程\x1b[0m`);
        process.exit(1);
      }
      readline.close();
    });
  } else {
    console.log(`\x1b[32m✓ 端口 ${PORT} 可用\x1b[0m`);
  }
} catch (error) {
  // 如果lsof命令失败，可能表示端口没有被使用
  console.log(`\x1b[32m✓ 端口 ${PORT} 可用\x1b[0m`);
}