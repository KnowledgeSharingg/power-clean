-- MySQL schema for power-clean-server
-- Generated on 2025-10-09 11:18 local time
-- Notes:
-- - UUIDs are stored as CHAR(36). Application assigns UUID values; DB defaults are not required.
-- - Foreign keys are intentionally NOT enforced where the JPA mapping used ForeignKey(ConstraintMode.NO_CONSTRAINT).
-- - Adjust engine/charset as needed.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Drop tables if they exist (order accounts for relations without FKs just in case)
DROP TABLE IF EXISTS `review`;
DROP TABLE IF EXISTS `book`;
DROP TABLE IF EXISTS `post`;
DROP TABLE IF EXISTS `oauth_profile`;
DROP TABLE IF EXISTS `account`;

-- account
CREATE TABLE `account` (
  `id` CHAR(36) NOT NULL,
  `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` DATETIME(6) NULL,

  `nickname` VARCHAR(255) NOT NULL,
  `email` VARCHAR(320) NOT NULL,
  `password` VARCHAR(255) NOT NULL,

  -- Embedded PersonalInfo fields
  `name` VARCHAR(255) NULL,
  `date_of_birth` VARCHAR(50) NULL,
  `phone_number` VARCHAR(50) NULL,
  `gender` VARCHAR(50) NULL,

  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_account_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- oauth_profile
CREATE TABLE `oauth_profile` (
  `id` CHAR(36) NOT NULL,
  `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` DATETIME(6) NULL,

  `type` VARCHAR(50) NOT NULL,
  `email` VARCHAR(320) NOT NULL,
  `login` VARCHAR(255) NULL,
  `profile_image_url` VARCHAR(1000) NULL,
  `account_id` CHAR(36) NULL,

  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_oauth_profile_email` (`email`),
  KEY `idx_oauth_profile_account_id` (`account_id`)
  -- No foreign key constraint on account_id by design
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- post
CREATE TABLE `post` (
  `id` CHAR(36) NOT NULL,
  `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` DATETIME(6) NULL,

  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `creator_account_id` CHAR(36) NOT NULL,
  `like_count` INT NOT NULL,

  PRIMARY KEY (`id`),
  KEY `idx_post_creator_account_id` (`creator_account_id`)
  -- No foreign key constraint on creator_account_id by design
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- book (one-to-one with post via post_id; unique index enforces 1:1)
CREATE TABLE `book` (
  `id` CHAR(36) NOT NULL,
  `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` DATETIME(6) NULL,

  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `link` VARCHAR(1000) NOT NULL,
  `cover_image_url` VARCHAR(1000) NOT NULL,

  -- Embedded AuthorInfo fields
  `author_name` VARCHAR(255) NOT NULL,
  `author_date_of_birth` VARCHAR(50) NOT NULL,
  `author_phone_number` VARCHAR(50) NOT NULL,
  `author_gender` VARCHAR(50) NOT NULL,
  `author_history` TEXT NOT NULL,

  `post_id` CHAR(36) NOT NULL,

  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_book_post_id` (`post_id`)
  -- No foreign key constraint on post_id by design
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- review (many-to-one to post via post_id)
CREATE TABLE `review` (
  `id` CHAR(36) NOT NULL,
  `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` DATETIME(6) NULL,

  `content` VARCHAR(1000) NOT NULL,
  `rating` INT NOT NULL,
  `creator_account_id` CHAR(36) NOT NULL,
  `post_id` CHAR(36) NOT NULL,

  PRIMARY KEY (`id`),
  KEY `idx_review_post_id` (`post_id`),
  KEY `idx_review_creator_account_id` (`creator_account_id`)
  -- No foreign key constraints by design
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
