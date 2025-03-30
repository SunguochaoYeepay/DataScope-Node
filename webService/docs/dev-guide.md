# 开发指南

## 开发环境设置

### 服务端口管理

默认情况下，DataScope API服务运行在端口5000上。以下是处理端口冲突的最佳实践。

#### 解决端口冲突 (EADDRINUSE)

当遇到以下错误时，表示端口已被其他进程占用：
```
Error: listen EADDRINUSE: address already in use :::5000
```

##### 解决方案：

1. **使用环境变量指定其他端口**：
   ```bash
   PORT=5001 npm run dev
   ```

2. **手动终止占用端口的进程**：
   ```bash
   # 查找占用端口的进程
   lsof -i :5000
   
   # 终止进程
   kill <PID>
   ```

3. **添加自动端口检查脚本**：

   在`scripts`目录下创建`check-port.js`：
   ```javascript
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
   ```

   在`package.json`中添加脚本：
   ```json
   "scripts": {
     "predev": "node scripts/check-port.js",
     "dev": "nodemon --watch 'src/**/*.ts' --exec 'ts-node' src/app.ts"
   }
   ```

4. **改进应用启动逻辑**：

   在`src/app.ts`中添加更友好的错误处理：
   ```typescript
   server.on('error', (error: NodeJS.ErrnoException) => {
     if (error.code === 'EADDRINUSE') {
       console.error(`\x1b[31m错误: 端口 ${PORT} 已被占用。\x1b[0m`);
       console.log('请尝试终止占用此端口的进程或使用其他端口。');
       process.exit(1);
     }
   });
   ```

### 开发环境最佳实践

1. **运行服务前检查端口**：
   ```bash
   node scripts/check-port.js
   ```

2. **启动多个服务实例时使用不同端口**：
   ```bash
   PORT=5001 npm run dev
   ```

3. **如果遇到频繁端口冲突**，可以在项目根目录创建`.env`文件并设置默认端口：
   ```
   PORT=5001
   ``` 