/**
 * 数据源密码重置脚本
 * 重置所有数据源的密码加密，使用当前的加密方法
 */
import { PrismaClient } from '@prisma/client';
import { encrypt } from '../src/utils/crypto';
import logger from '../src/utils/logger';

const DEFAULT_PASSWORD = 'password';  // 重置为默认密码
const prisma = new PrismaClient();

/**
 * 重置数据源密码
 */
async function resetDataSourcePasswords() {
  logger.info('开始重置数据源密码');
  
  try {
    // 获取所有数据源
    const dataSources = await prisma.dataSource.findMany();
    
    logger.info(`找到 ${dataSources.length} 个数据源需要重置密码`);
    
    // 重置每个数据源的密码
    for (const dataSource of dataSources) {
      try {
        // 使用当前加密方法加密默认密码
        const { encrypted, salt } = encrypt(DEFAULT_PASSWORD);
        
        // 更新数据源密码
        await prisma.dataSource.update({
          where: { id: dataSource.id },
          data: {
            passwordEncrypted: encrypted,
            passwordSalt: salt,
            updatedAt: new Date(),
            updatedBy: 'system-reset'
          }
        });
        
        logger.info(`成功重置数据源 ID: ${dataSource.id}, 名称: ${dataSource.name}`);
      } catch (error: any) {
        logger.error(`重置数据源密码失败 ID: ${dataSource.id}`, { error });
      }
    }
    
    logger.info('数据源密码重置完成');
  } catch (error: any) {
    logger.error('重置密码过程中发生错误', { error });
  } finally {
    await prisma.$disconnect();
  }
}

// 执行重置
resetDataSourcePasswords();