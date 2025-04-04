// 设置测试数据源脚本
// 用于创建测试数据源和示例查询

import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

// 初始化Prisma客户端
const prisma = new PrismaClient();

// 生成加密密码
function encryptPassword(password: string): { encrypted: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const encrypted = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  return { encrypted, salt };
}

// 清理现有数据
async function cleanupExistingData() {
  console.log('正在清理现有数据...');
  
  try {
    // 删除所有查询相关数据
    await prisma.$executeRaw`DELETE FROM tbl_query_history WHERE 1=1`;
    console.log('已清理查询历史记录');
  } catch (e) {
    console.log('清理查询历史记录失败，可能表不存在');
  }
  
  try {
    await prisma.$executeRaw`DELETE FROM tbl_query_version WHERE 1=1`;
    console.log('已清理查询版本');
  } catch (e) {
    console.log('清理查询版本失败，可能表不存在');
  }
  
  try {
    await prisma.$executeRaw`DELETE FROM tbl_query WHERE 1=1`;
    console.log('已清理查询');
  } catch (e) {
    console.log('清理查询失败，可能表不存在');
  }
  
  try {
    // 删除所有数据源
    await prisma.$executeRaw`DELETE FROM tbl_data_source WHERE 1=1`;
    console.log('已清理数据源');
  } catch (e) {
    console.log('清理数据源失败，可能表不存在');
  }
  
  console.log('数据清理完成');
}

// 创建测试数据源
async function createTestDataSource() {
  console.log('正在创建测试数据源...');
  
  // 为测试数据源创建加密密码
  const { encrypted, salt } = encryptPassword('datascope');
  
  // 创建本地MariaDB数据源 - 使用最简单的配置
  const testDataSourceId = 'test-local-mariadb'; // 使用固定ID便于查找
  await prisma.$executeRaw`
    INSERT INTO tbl_data_source (
      id, name, description, type, host, port, databaseName, username, 
      passwordEncrypted, passwordSalt, status, createdBy, updatedBy, active, nonce, createdAt, updatedAt
    ) VALUES (
      ${testDataSourceId}, '本地测试数据库', '本地测试数据库 - 一定可用', 'mysql', 'localhost', 3307, 
      'datascope', 'root', ${encrypted}, ${salt}, 'ACTIVE', 'system', 'system', 1, 1,
      NOW(), NOW()
    )
  `;
  
  console.log('已创建本地测试数据源:', testDataSourceId);
  
  return { testDataSource: { id: testDataSourceId } };
}

// 创建示例查询
async function createExampleQueries(dataSourceId: string) {
  console.log('正在创建示例查询...');
  
  // 创建一个简单查询
  const queryId = uuidv4();
  await prisma.$executeRaw`
    INSERT INTO tbl_query (
      id, name, description, dataSourceId, sqlContent, status, queryType, 
      isFavorite, executionCount, lastExecutedAt, tags, nonce, createdAt, updatedAt, createdBy, updatedBy
    ) VALUES (
      ${queryId}, '数据源查询', '查询所有数据源', ${dataSourceId}, 'SELECT * FROM tbl_data_source', 
      'DRAFT', 'SQL', 0, 1, NOW(), 'example,test', 1, NOW(), NOW(), 'system', 'system'
    )
  `;
  
  console.log('已创建示例查询:', queryId);
  
  // 创建查询版本
  const versionId = uuidv4();
  await prisma.$executeRaw`
    INSERT INTO tbl_query_version (
      id, queryId, versionNumber, versionStatus, sqlContent, dataSourceId, description, createdAt, updatedAt, createdBy
    ) VALUES (
      ${versionId}, ${queryId}, 1, 'PUBLISHED', 'SELECT * FROM tbl_data_source', ${dataSourceId}, '初始版本',
      NOW(), NOW(), 'system'
    )
  `;
  
  console.log('已创建查询版本:', versionId);
  
  return { 
    simpleQuery: { id: queryId },
    queryVersion: { id: versionId }
  };
}

// 主函数
async function main() {
  try {
    console.log('开始设置测试数据源和示例查询...');
    
    // 清理现有数据
    await cleanupExistingData();
    
    // 创建测试数据源 - 只创建一个一定能用的
    const { testDataSource } = await createTestDataSource();
    
    // 创建示例查询
    await createExampleQueries(testDataSource.id);
    
    console.log('=== 测试数据源设置完成 ===');
    console.log('本地测试数据源ID:', testDataSource.id);
    console.log('请使用此ID进行API测试');
    
  } catch (error) {
    console.error('设置测试数据源时出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 执行主函数
main();
