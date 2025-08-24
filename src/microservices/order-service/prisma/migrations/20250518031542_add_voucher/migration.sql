-- CreateTable
CREATE TABLE `Voucher` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL DEFAULT '',
    `code` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'discount',
    `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiryDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `usageCount` INTEGER NOT NULL DEFAULT 0,
    `usagePerUser` INTEGER NOT NULL DEFAULT 1,
    `minOrderValue` DOUBLE NOT NULL DEFAULT 0,
    `discountAmount` DOUBLE NOT NULL DEFAULT 0,
    `discountPercent` DOUBLE NOT NULL DEFAULT 0,
    `maxDiscountValue` DOUBLE NOT NULL DEFAULT 0,
    `itemList` LONGTEXT NULL,
    `icon` LONGTEXT NULL,
    `image_url` VARCHAR(1000) NOT NULL DEFAULT '',
    `tenantId` INTEGER NOT NULL DEFAULT 0,
    `platform` VARCHAR(191) NOT NULL DEFAULT 'all',
    `userType` VARCHAR(191) NOT NULL DEFAULT 'all',
    `isPublic` BOOLEAN NOT NULL DEFAULT true,
    `isFreeShipping` BOOLEAN NOT NULL DEFAULT false,
    `addedValue` DOUBLE NOT NULL DEFAULT 0,
    `totalDenomination` DOUBLE NOT NULL DEFAULT 0,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `userUpdate` VARCHAR(191) NOT NULL DEFAULT '',
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateDate` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `isShow` BOOLEAN NOT NULL DEFAULT false,
    `value1` LONGTEXT NULL,
    `value2` LONGTEXT NULL,
    `value3` LONGTEXT NULL,
    `number1` DOUBLE NULL DEFAULT 0,
    `number2` DOUBLE NULL DEFAULT 0,
    `number3` DOUBLE NULL DEFAULT 0,
    `bool1` BOOLEAN NULL DEFAULT false,
    `bool2` BOOLEAN NULL DEFAULT false,
    `bool3` BOOLEAN NULL DEFAULT false,

    UNIQUE INDEX `Voucher_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserVoucher` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL DEFAULT 0,
    `voucherId` INTEGER NOT NULL,
    `userUpdate` VARCHAR(191) NOT NULL DEFAULT '',
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateDate` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `isShow` BOOLEAN NOT NULL DEFAULT false,
    `value1` LONGTEXT NULL,
    `value2` LONGTEXT NULL,
    `value3` LONGTEXT NULL,
    `number1` DOUBLE NULL DEFAULT 0,
    `number2` DOUBLE NULL DEFAULT 0,
    `number3` DOUBLE NULL DEFAULT 0,
    `bool1` BOOLEAN NULL DEFAULT false,
    `bool2` BOOLEAN NULL DEFAULT false,
    `bool3` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserVoucher` ADD CONSTRAINT `UserVoucher_voucherId_fkey` FOREIGN KEY (`voucherId`) REFERENCES `Voucher`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
