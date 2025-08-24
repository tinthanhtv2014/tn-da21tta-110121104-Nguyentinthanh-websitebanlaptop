-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL DEFAULT 0,
    `quantity` INTEGER NOT NULL DEFAULT 0,
    `orderStatus` VARCHAR(191) NOT NULL DEFAULT '',
    `paymentStatus` BOOLEAN NOT NULL DEFAULT false,
    `paymentMethod` VARCHAR(191) NOT NULL DEFAULT '',
    `promotion` LONGTEXT NOT NULL,
    `listProducts` LONGTEXT NOT NULL,
    `user_info` LONGTEXT NOT NULL,
    `totalOrderPrice` DOUBLE NOT NULL DEFAULT 0,
    `orderId` VARCHAR(191) NOT NULL DEFAULT '',
    `tenantId` INTEGER NOT NULL DEFAULT 0,
    `userUpdate` INTEGER NULL DEFAULT 0,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateDate` DATETIME(3) NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `plusPoint` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
