#!/usr/bin/env node

/**
 * 端口占用检测与释放工具
 * 会根据传入的端口号，自动检测并关闭占用该端口的进程
 */

import { execSync } from 'child_process';
import os from 'os';

// 获取命令行参数
const args = process.argv.slice(2);
const PORT = args[0] || 8080; // 默认端口为8080

console.log(`\x1b[36m[端口管理] 检查端口 ${PORT} 是否被占用...\x1b[0m`);

// 根据操作系统类型选择不同的命令
const platform = os.platform();

try {
  let findCommand, killCommand;
  
  if (platform === 'win32') {
    // Windows
    findCommand = `netstat -ano | findstr :${PORT} | findstr LISTENING`;
    
    const output = execSync(findCommand, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    if (output && output.trim()) {
      // 从输出中提取PID
      const pidMatch = output.match(/\s+(\d+)$/m);
      if (pidMatch && pidMatch[1]) {
        const pid = pidMatch[1];
        console.log(`\x1b[33m[端口管理] 发现端口 ${PORT} 被进程 PID: ${pid} 占用，正在尝试关闭...\x1b[0m`);
        killCommand = `taskkill /F /PID ${pid}`;
        execSync(killCommand, { stdio: ['pipe', 'pipe', 'ignore'] });
        console.log(`\x1b[32m[端口管理] 成功关闭占用端口 ${PORT} 的进程 (PID: ${pid})\x1b[0m`);
      }
    } else {
      console.log(`\x1b[32m[端口管理] 端口 ${PORT} 未被占用\x1b[0m`);
    }
  } else {
    // macOS, Linux等Unix系统
    findCommand = `lsof -i :${PORT} -t`;
    
    try {
      const pids = execSync(findCommand, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
      
      if (pids) {
        console.log(`\x1b[33m[端口管理] 发现端口 ${PORT} 被进程占用，PID: ${pids}，正在关闭...\x1b[0m`);
        // 在Unix系统中，可以一次性杀死多个进程
        killCommand = `kill -9 ${pids}`;
        execSync(killCommand, { stdio: ['pipe', 'pipe', 'ignore'] });
        console.log(`\x1b[32m[端口管理] 成功关闭占用端口 ${PORT} 的进程\x1b[0m`);
      } else {
        console.log(`\x1b[32m[端口管理] 端口 ${PORT} 未被占用\x1b[0m`);
      }
    } catch (e) {
      // 如果lsof命令执行失败，可能是没有进程占用该端口
      console.log(`\x1b[32m[端口管理] 端口 ${PORT} 未被占用\x1b[0m`);
    }
  }
} catch (err) {
  // 忽略错误，如果找不到进程或无法杀死进程
  console.log(`\x1b[32m[端口管理] 端口 ${PORT} 未被占用或处理过程中发生错误\x1b[0m`);
  console.log(`\x1b[32m[端口管理] 继续启动开发服务器...\x1b[0m`);
}

// 完成端口检查，程序继续执行
console.log(`\x1b[36m[端口管理] 端口检查完成，准备启动开发服务器...\x1b[0m`); 