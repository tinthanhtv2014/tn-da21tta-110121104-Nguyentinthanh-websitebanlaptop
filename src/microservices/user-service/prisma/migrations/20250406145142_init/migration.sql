/*
  Warnings:

  - You are about to drop the column `listTenant` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `listTenant`,
    ADD COLUMN `CodeAddress` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `rule` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `userCreate` INTEGER NULL DEFAULT 0,
    ADD COLUMN `userUpdate` INTEGER NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roleName` VARCHAR(191) NOT NULL DEFAULT '',
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateDate` DATETIME(3) NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `listPermision` LONGTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
