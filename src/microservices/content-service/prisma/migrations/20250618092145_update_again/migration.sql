/*
  Warnings:

  - The primary key for the `comment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `CommentID` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `Content_comment` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `Status_comment` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `createAt_comment` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt_comment` on the `comment` table. All the data in the column will be lost.
  - Added the required column `id` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `comment` DROP PRIMARY KEY,
    DROP COLUMN `CommentID`,
    DROP COLUMN `Content_comment`,
    DROP COLUMN `Status_comment`,
    DROP COLUMN `createAt_comment`,
    DROP COLUMN `updateAt_comment`,
    ADD COLUMN `content` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `updateDate` DATETIME(3) NULL,
    ADD PRIMARY KEY (`id`);
