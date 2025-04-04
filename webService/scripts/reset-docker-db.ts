/**
 * Docker数据库重置脚本
 * 重置Docker环境中的数据库并导入基本测试数据
 */

import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';
import * as util from 'util';
import { exec as execCb } from 'child_process';

const exec = util.promisify(execCb);

// 初始化Prisma客户端
const prisma = new PrismaClient();

// 加密密码函数
function encryptPassword(password: string): { encrypted: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { encrypted: hash, salt };
}

async function resetDockerDatabase() {
  console.log('🚀 开始重置Docker数据库...');
  
  try {
    // 检查数据库连接
    await prisma.$connect();
    console.log('✅ 数据库连接成功!');
    
    // 使用Prisma强制推送架构
    console.log('正在重置数据库架构...');
    await exec('npx prisma db push --force-reset');
    console.log('✅ 数据库架构重置成功!');
    
    // 创建测试数据源
    console.log('正在创建测试数据源...');
    
    // 加密密码
    const pwd = 'datascope';
    const { encrypted, salt } = encryptPassword(pwd);
    
    // 创建Docker MariaDB数据源
    const dockerMariaDB = await prisma.dataSource.create({
      data: {
        name: 'Docker MariaDB',
        description: 'Docker容器中的MariaDB数据库',
        type: 'mysql',
        host: 'localhost',
        port: 3307,
        databaseName: 'datascope',
        username: 'root',
        passwordEncrypted: encrypted,
        passwordSalt: salt,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system',
        updatedBy: 'system',
        active: true
      }
    });
    
    // 创建本地MariaDB数据源
    const localMariaDB = await prisma.dataSource.create({
      data: {
        name: '本地MariaDB',
        description: '本地MariaDB数据库',
        type: 'mysql',
        host: 'localhost',
        port: 3307,
        databaseName: 'datascope',
        username: 'root',
        passwordEncrypted: encrypted,
        passwordSalt: salt,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system',
        updatedBy: 'system',
        active: true
      }
    });
    
    console.log('✅ 测试数据源创建成功!');
    console.log(`   - Docker MariaDB ID: ${dockerMariaDB.id}`);
    console.log(`   - 本地MariaDB ID: ${localMariaDB.id}`);
    
    // 创建示例查询
    console.log('正在创建示例查询...');
    
    const sampleQuery = await prisma.query.create({
      data: {
        name: '示例查询 - 数据源表',
        description: '查询所有数据源',
        dataSourceId: localMariaDB.id,
        sqlContent: 'SELECT * FROM tbl_data_source',
        status: 'PUBLISHED',
        queryType: 'SQL',
        isFavorite: false,
        executionCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system',
        updatedBy: 'system'
      }
    });
    
    console.log('✅ 示例查询创建成功!');
    console.log(`   - 查询ID: ${sampleQuery.id}`);
    
    console.log('✅ Docker数据库重置完成!');
  } catch (error) {
    console.error('❌ 数据库重置失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 执行重置
resetDockerDatabase().catch(e => {
  console.error('程序执行错误:', e);
  process.exit(1);
}); 