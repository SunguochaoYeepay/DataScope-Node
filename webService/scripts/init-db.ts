/**
 * 数据库初始化脚本
 * 
 * 此脚本用于初始化项目所需的数据库和表结构
 * 它会检查数据库连接，并触发必要的Prisma迁移
 */

import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import * as util from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execPromise = util.promisify(exec);
const prisma = new PrismaClient();

/**
 * 检查数据库连接
 */
async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$connect();
    console.log('✅ 数据库连接成功!');
    return true;
  } catch (error: any) {
    console.error('❌ 数据库连接失败:', error.message);
    return false;
  }
}

/**
 * 执行Prisma迁移
 */
async function runPrismaMigration(): Promise<void> {
  try {
    console.log('正在执行Prisma迁移...');
    const { stdout, stderr } = await execPromise('npx prisma migrate dev --name init');
    if (stderr) {
      console.error('迁移警告:', stderr);
    }
    console.log('迁移输出:', stdout);
    console.log('✅ Prisma迁移完成!');
  } catch (error: any) {
    console.error('❌ Prisma迁移失败:', error.message);
    throw error;
  }
}

/**
 * 生成Prisma客户端
 */
async function generatePrismaClient(): Promise<void> {
  try {
    console.log('正在生成Prisma客户端...');
    const { stdout, stderr } = await execPromise('npx prisma generate');
    if (stderr) {
      console.error('生成警告:', stderr);
    }
    console.log('生成输出:', stdout);
    console.log('✅ Prisma客户端生成完成!');
  } catch (error: any) {
    console.error('❌ Prisma客户端生成失败:', error.message);
    throw error;
  }
}

/**
 * 创建必要的目录
 */
function createDirectories(): void {
  const dirs = [
    path.join(__dirname, '../prisma/migrations'),
  ];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ 创建目录: ${dir}`);
    }
  }
}

/**
 * 初始化数据库
 */
async function initializeDatabase(): Promise<void> {
  try {
    console.log('🚀 开始数据库初始化...');
    
    // 创建必要的目录
    createDirectories();
    
    // 检查数据库连接
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      throw new Error('无法继续，数据库连接失败');
    }
    
    // 执行Prisma迁移
    await runPrismaMigration();
    
    // 生成Prisma客户端
    await generatePrismaClient();
    
    console.log('🎉 数据库初始化完成!');
  } catch (error: any) {
    console.error('❌ 数据库初始化失败:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// 执行初始化
initializeDatabase(); 