"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 密码迁移脚本 - 将旧的哈希加密密码改为AES可解密加密
 */
const client_1 = require("@prisma/client");
const crypto_1 = require("../utils/crypto");
const logger_1 = __importDefault(require("../utils/logger"));
const DEFAULT_PASSWORD = 'password'; // 迁移时使用的默认密码
const prisma = new client_1.PrismaClient();
/**
 * 执行迁移
 */
async function migratePasswords() {
    logger_1.default.info('开始密码加密方式迁移');
    try {
        // 获取所有数据源
        const dataSources = await prisma.dataSource.findMany();
        logger_1.default.info(`找到 ${dataSources.length} 个数据源需要迁移`);
        // 迁移每个数据源的密码
        for (const dataSource of dataSources) {
            try {
                // 使用新的加密方法加密默认密码
                const { encrypted, salt } = (0, crypto_1.encrypt)(DEFAULT_PASSWORD);
                // 更新数据源密码
                await prisma.dataSource.update({
                    where: { id: dataSource.id },
                    data: {
                        passwordEncrypted: encrypted,
                        passwordSalt: salt,
                        updatedAt: new Date(),
                        updatedBy: 'system-migration'
                    }
                });
                logger_1.default.info(`成功迁移数据源 ID: ${dataSource.id}, 名称: ${dataSource.name}`);
            }
            catch (error) {
                logger_1.default.error(`迁移数据源密码失败 ID: ${dataSource.id}`, { error });
            }
        }
        logger_1.default.info('密码加密方式迁移完成');
    }
    catch (error) {
        logger_1.default.error('密码迁移过程中发生错误', { error });
    }
    finally {
        await prisma.$disconnect();
    }
}
// 执行迁移
migratePasswords()
    .catch(error => {
    logger_1.default.error('迁移脚本执行失败', { error });
    process.exit(1);
});
//# sourceMappingURL=migrate-passwords.js.map