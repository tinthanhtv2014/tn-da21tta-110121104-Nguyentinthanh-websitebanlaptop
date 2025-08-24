-- CreateTable
CREATE TABLE `administrative_regions` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `name_en` VARCHAR(255) NOT NULL,
    `code_name` VARCHAR(255) NULL,
    `code_name_en` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `administrative_units` (
    `id` INTEGER NOT NULL,
    `full_name` VARCHAR(255) NULL,
    `full_name_en` VARCHAR(255) NULL,
    `short_name` VARCHAR(255) NULL,
    `short_name_en` VARCHAR(255) NULL,
    `code_name` VARCHAR(255) NULL,
    `code_name_en` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `districts` (
    `code` VARCHAR(20) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `name_en` VARCHAR(255) NULL,
    `full_name` VARCHAR(255) NULL,
    `full_name_en` VARCHAR(255) NULL,
    `code_name` VARCHAR(255) NULL,
    `province_code` VARCHAR(20) NULL,
    `administrative_unit_id` INTEGER NULL,

    INDEX `idx_districts_province`(`province_code`),
    INDEX `idx_districts_unit`(`administrative_unit_id`),
    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `provinces` (
    `code` VARCHAR(20) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `name_en` VARCHAR(255) NULL,
    `full_name` VARCHAR(255) NOT NULL,
    `full_name_en` VARCHAR(255) NULL,
    `code_name` VARCHAR(255) NULL,
    `administrative_unit_id` INTEGER NULL,
    `administrative_region_id` INTEGER NULL,
    `lat` DOUBLE NOT NULL DEFAULT 0.0,
    `lng` DOUBLE NOT NULL DEFAULT 0.0,

    INDEX `idx_provinces_region`(`administrative_region_id`),
    INDEX `idx_provinces_unit`(`administrative_unit_id`),
    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wards` (
    `code` VARCHAR(20) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `name_en` VARCHAR(255) NULL,
    `full_name` VARCHAR(255) NULL,
    `full_name_en` VARCHAR(255) NULL,
    `code_name` VARCHAR(255) NULL,
    `district_code` VARCHAR(20) NULL,
    `administrative_unit_id` INTEGER NULL,

    INDEX `idx_wards_district`(`district_code`),
    INDEX `idx_wards_unit`(`administrative_unit_id`),
    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `districts` ADD CONSTRAINT `districts_administrative_unit_id_fkey` FOREIGN KEY (`administrative_unit_id`) REFERENCES `administrative_units`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `districts` ADD CONSTRAINT `districts_province_code_fkey` FOREIGN KEY (`province_code`) REFERENCES `provinces`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `provinces` ADD CONSTRAINT `provinces_administrative_region_id_fkey` FOREIGN KEY (`administrative_region_id`) REFERENCES `administrative_regions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `provinces` ADD CONSTRAINT `provinces_administrative_unit_id_fkey` FOREIGN KEY (`administrative_unit_id`) REFERENCES `administrative_units`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `wards` ADD CONSTRAINT `wards_administrative_unit_id_fkey` FOREIGN KEY (`administrative_unit_id`) REFERENCES `administrative_units`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `wards` ADD CONSTRAINT `wards_district_code_fkey` FOREIGN KEY (`district_code`) REFERENCES `districts`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION;
