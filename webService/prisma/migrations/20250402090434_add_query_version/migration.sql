/*
  Warnings:

  - You are about to drop the column `current_version_id` on the `tbl_query` table. All the data in the column will be lost.
  - You are about to drop the column `disabled_at` on the `tbl_query` table. All the data in the column will be lost.
  - You are about to drop the column `disabled_reason` on the `tbl_query` table. All the data in the column will be lost.
  - You are about to drop the column `service_status` on the `tbl_query` table. All the data in the column will be lost.
  - You are about to drop the column `versions_count` on the `tbl_query` table. All the data in the column will be lost.
  - You are about to drop the column `execution_time_ms` on the `tbl_query_history` table. All the data in the column will be lost.
  - You are about to drop the column `row_count` on the `tbl_query_history` table. All the data in the column will be lost.
  - You are about to drop the column `version_id` on the `tbl_query_history` table. All the data in the column will be lost.
  - You are about to drop the column `version_number` on the `tbl_query_history` table. All the data in the column will be lost.
  - The primary key for the `tbl_query_version` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `tbl_query_version` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `tbl_query_version` table. All the data in the column will be lost.
  - You are about to drop the column `data_source_id` on the `tbl_query_version` table. All the data in the column will be lost.
  - You are about to drop the column `deprecated_at` on the `tbl_query_version` table. All the data in the column will be lost.
  - You are about to drop the column `published_at` on the `tbl_query_version` table. All the data in the column will be lost.
  - You are about to drop the column `query_id` on the `tbl_query_version` table. All the data in the column will be lost.
  - You are about to drop the column `sql_content` on the `tbl_query_version` table. All the data in the column will be lost.
  - You are about to drop the column `version_number` on the `tbl_query_version` table. All the data in the column will be lost.
  - You are about to drop the column `version_status` on the `tbl_query_version` table. All the data in the column will be lost.
  - Added the required column `dataSourceId` to the `tbl_query_version` table without a default value. This is not possible if the table is not empty.
  - Added the required column `queryId` to the `tbl_query_version` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sqlContent` to the `tbl_query_version` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `tbl_query_version` table without a default value. This is not possible if the table is not empty.
  - Added the required column `versionNumber` to the `tbl_query_version` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `tbl_query_version` DROP FOREIGN KEY `fk_query_version_data_source_id`;

-- DropForeignKey
ALTER TABLE `tbl_query_version` DROP FOREIGN KEY `fk_query_version_query_id`;

-- DropIndex
DROP INDEX `idx_query_history_version_id` ON `tbl_query_history`;

-- DropIndex
DROP INDEX `idx_query_versions_created_at` ON `tbl_query_version`;

-- DropIndex
DROP INDEX `idx_query_versions_status` ON `tbl_query_version`;

-- AlterTable
ALTER TABLE `tbl_query` DROP COLUMN `current_version_id`,
    DROP COLUMN `disabled_at`,
    DROP COLUMN `disabled_reason`,
    DROP COLUMN `service_status`,
    DROP COLUMN `versions_count`,
    ADD COLUMN `currentVersionId` VARCHAR(191) NULL,
    ADD COLUMN `disabledAt` DATETIME(3) NULL,
    ADD COLUMN `disabledReason` TEXT NULL,
    ADD COLUMN `draftVersionId` VARCHAR(191) NULL,
    ADD COLUMN `serviceStatus` VARCHAR(191) NOT NULL DEFAULT 'ENABLED';

-- AlterTable
ALTER TABLE `tbl_query_history` DROP COLUMN `execution_time_ms`,
    DROP COLUMN `row_count`,
    DROP COLUMN `version_id`,
    DROP COLUMN `version_number`;

-- AlterTable
ALTER TABLE `tbl_query_version` DROP PRIMARY KEY,
    DROP COLUMN `created_at`,
    DROP COLUMN `created_by`,
    DROP COLUMN `data_source_id`,
    DROP COLUMN `deprecated_at`,
    DROP COLUMN `published_at`,
    DROP COLUMN `query_id`,
    DROP COLUMN `sql_content`,
    DROP COLUMN `version_number`,
    DROP COLUMN `version_status`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `createdBy` VARCHAR(191) NULL DEFAULT 'system',
    ADD COLUMN `dataSourceId` VARCHAR(191) NOT NULL,
    ADD COLUMN `deprecatedAt` DATETIME(3) NULL,
    ADD COLUMN `publishedAt` DATETIME(3) NULL,
    ADD COLUMN `queryId` VARCHAR(191) NOT NULL,
    ADD COLUMN `sqlContent` TEXT NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `versionNumber` INTEGER NOT NULL,
    ADD COLUMN `versionStatus` VARCHAR(191) NOT NULL DEFAULT 'DRAFT',
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `parameters` TEXT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE INDEX `tbl_query_version_queryId_idx` ON `tbl_query_version`(`queryId`);

-- AddForeignKey
ALTER TABLE `tbl_query_version` ADD CONSTRAINT `tbl_query_version_queryId_fkey` FOREIGN KEY (`queryId`) REFERENCES `tbl_query`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_query_version` ADD CONSTRAINT `tbl_query_version_dataSourceId_fkey` FOREIGN KEY (`dataSourceId`) REFERENCES `tbl_data_source`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
