-- CreateTable
CREATE TABLE `tbl_data_source` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `type` VARCHAR(191) NOT NULL,
    `host` VARCHAR(191) NOT NULL,
    `port` INTEGER NOT NULL,
    `databaseName` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `passwordEncrypted` VARCHAR(191) NOT NULL,
    `passwordSalt` VARCHAR(191) NOT NULL,
    `connectionParams` JSON NULL,
    `status` VARCHAR(191) NOT NULL,
    `syncFrequency` VARCHAR(191) NULL,
    `lastSyncTime` DATETIME(3) NULL,
    `nonce` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL DEFAULT 'system',
    `updatedBy` VARCHAR(191) NOT NULL DEFAULT 'system',
    `active` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_schema` (
    `id` VARCHAR(191) NOT NULL,
    `dataSourceId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `nonce` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL DEFAULT 'system',
    `updatedBy` VARCHAR(191) NOT NULL DEFAULT 'system',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_table` (
    `id` VARCHAR(191) NOT NULL,
    `schemaId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'TABLE',
    `nonce` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL DEFAULT 'system',
    `updatedBy` VARCHAR(191) NOT NULL DEFAULT 'system',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_column` (
    `id` VARCHAR(191) NOT NULL,
    `tableId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `dataType` VARCHAR(191) NOT NULL,
    `length` INTEGER NULL,
    `precision` INTEGER NULL,
    `scale` INTEGER NULL,
    `nullable` BOOLEAN NOT NULL DEFAULT true,
    `isPrimaryKey` BOOLEAN NOT NULL DEFAULT false,
    `isForeignKey` BOOLEAN NOT NULL DEFAULT false,
    `defaultValue` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `nonce` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL DEFAULT 'system',
    `updatedBy` VARCHAR(191) NOT NULL DEFAULT 'system',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_table_relationship` (
    `id` VARCHAR(191) NOT NULL,
    `sourceTableId` VARCHAR(191) NOT NULL,
    `targetTableId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `confidence` DOUBLE NOT NULL DEFAULT 1.0,
    `isAutoDetected` BOOLEAN NOT NULL DEFAULT false,
    `nonce` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL DEFAULT 'system',
    `updatedBy` VARCHAR(191) NOT NULL DEFAULT 'system',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_column_relationship` (
    `id` VARCHAR(191) NOT NULL,
    `tableRelationshipId` VARCHAR(191) NOT NULL,
    `sourceColumnId` VARCHAR(191) NOT NULL,
    `targetColumnId` VARCHAR(191) NOT NULL,
    `nonce` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL DEFAULT 'system',
    `updatedBy` VARCHAR(191) NOT NULL DEFAULT 'system',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_query` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `dataSourceId` VARCHAR(191) NOT NULL,
    `sqlContent` TEXT NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'DRAFT',
    `queryType` VARCHAR(191) NOT NULL DEFAULT 'SQL',
    `isFavorite` BOOLEAN NOT NULL DEFAULT false,
    `executionCount` INTEGER NOT NULL DEFAULT 0,
    `lastExecutedAt` DATETIME(3) NULL,
    `tags` VARCHAR(191) NULL,
    `nonce` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL DEFAULT 'system',
    `updatedBy` VARCHAR(191) NOT NULL DEFAULT 'system',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_query_history` (
    `id` VARCHAR(191) NOT NULL,
    `queryId` VARCHAR(191) NULL,
    `dataSourceId` VARCHAR(191) NOT NULL,
    `sqlContent` TEXT NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NULL,
    `duration` INTEGER NULL,
    `rowCount` INTEGER NULL,
    `errorMessage` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` VARCHAR(191) NOT NULL DEFAULT 'system',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_display_config` (
    `id` VARCHAR(191) NOT NULL,
    `queryId` VARCHAR(191) NOT NULL,
    `displayType` VARCHAR(191) NOT NULL,
    `chartType` VARCHAR(191) NULL,
    `title` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `config` JSON NOT NULL,
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `nonce` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL DEFAULT 'system',
    `updatedBy` VARCHAR(191) NOT NULL DEFAULT 'system',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_metadata_sync_history` (
    `id` VARCHAR(191) NOT NULL,
    `dataSourceId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NULL,
    `duration` INTEGER NULL,
    `syncType` VARCHAR(191) NOT NULL,
    `tablesCount` INTEGER NULL,
    `viewsCount` INTEGER NULL,
    `relationshipsCount` INTEGER NULL,
    `errorMessage` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` VARCHAR(191) NOT NULL DEFAULT 'system',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_query_plan` (
    `id` VARCHAR(191) NOT NULL,
    `queryId` VARCHAR(191) NULL,
    `dataSourceId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `sql` TEXT NOT NULL,
    `planData` TEXT NOT NULL,
    `estimatedCost` DOUBLE NULL,
    `optimizationTips` TEXT NULL,
    `isAnalyzed` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL DEFAULT 'system',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_query_plan_comparison` (
    `id` VARCHAR(191) NOT NULL,
    `planAId` VARCHAR(191) NOT NULL,
    `planBId` VARCHAR(191) NOT NULL,
    `comparisonData` TEXT NOT NULL,
    `improvement` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` VARCHAR(191) NOT NULL DEFAULT 'system',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_query_plan_history` (
    `id` VARCHAR(191) NOT NULL,
    `dataSourceId` VARCHAR(191) NOT NULL,
    `sql` TEXT NOT NULL,
    `planData` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_saved_query` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `sql` TEXT NOT NULL,
    `dataSourceId` VARCHAR(191) NOT NULL,
    `tags` VARCHAR(191) NOT NULL,
    `folderId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_query_folder` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `parentId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_query_favorite` (
    `id` VARCHAR(191) NOT NULL,
    `queryId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL DEFAULT 'anonymous',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_metadata` (
    `id` VARCHAR(191) NOT NULL,
    `dataSourceId` VARCHAR(191) NOT NULL,
    `structure` LONGTEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbl_schema` ADD CONSTRAINT `tbl_schema_dataSourceId_fkey` FOREIGN KEY (`dataSourceId`) REFERENCES `tbl_data_source`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_table` ADD CONSTRAINT `tbl_table_schemaId_fkey` FOREIGN KEY (`schemaId`) REFERENCES `tbl_schema`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_column` ADD CONSTRAINT `tbl_column_tableId_fkey` FOREIGN KEY (`tableId`) REFERENCES `tbl_table`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_table_relationship` ADD CONSTRAINT `tbl_table_relationship_sourceTableId_fkey` FOREIGN KEY (`sourceTableId`) REFERENCES `tbl_table`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_table_relationship` ADD CONSTRAINT `tbl_table_relationship_targetTableId_fkey` FOREIGN KEY (`targetTableId`) REFERENCES `tbl_table`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_column_relationship` ADD CONSTRAINT `tbl_column_relationship_tableRelationshipId_fkey` FOREIGN KEY (`tableRelationshipId`) REFERENCES `tbl_table_relationship`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_column_relationship` ADD CONSTRAINT `tbl_column_relationship_sourceColumnId_fkey` FOREIGN KEY (`sourceColumnId`) REFERENCES `tbl_column`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_column_relationship` ADD CONSTRAINT `tbl_column_relationship_targetColumnId_fkey` FOREIGN KEY (`targetColumnId`) REFERENCES `tbl_column`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_query` ADD CONSTRAINT `tbl_query_dataSourceId_fkey` FOREIGN KEY (`dataSourceId`) REFERENCES `tbl_data_source`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_query_history` ADD CONSTRAINT `tbl_query_history_queryId_fkey` FOREIGN KEY (`queryId`) REFERENCES `tbl_query`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_display_config` ADD CONSTRAINT `tbl_display_config_queryId_fkey` FOREIGN KEY (`queryId`) REFERENCES `tbl_query`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_query_plan` ADD CONSTRAINT `tbl_query_plan_queryId_fkey` FOREIGN KEY (`queryId`) REFERENCES `tbl_query`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_query_plan_comparison` ADD CONSTRAINT `tbl_query_plan_comparison_planAId_fkey` FOREIGN KEY (`planAId`) REFERENCES `tbl_query_plan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_query_plan_comparison` ADD CONSTRAINT `tbl_query_plan_comparison_planBId_fkey` FOREIGN KEY (`planBId`) REFERENCES `tbl_query_plan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_saved_query` ADD CONSTRAINT `tbl_saved_query_dataSourceId_fkey` FOREIGN KEY (`dataSourceId`) REFERENCES `tbl_data_source`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_saved_query` ADD CONSTRAINT `tbl_saved_query_folderId_fkey` FOREIGN KEY (`folderId`) REFERENCES `tbl_query_folder`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_query_folder` ADD CONSTRAINT `tbl_query_folder_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `tbl_query_folder`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
