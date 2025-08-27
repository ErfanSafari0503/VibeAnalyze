/*
  Warnings:

  - The primary key for the `analyses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `status` column on the `analyses` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `comments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `comment` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `comments` table. All the data in the column will be lost.
  - You are about to alter the column `rating` on the `comments` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to alter the column `satisfaction_score` on the `comments` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - The `positive_sentences` column on the `comments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `tone` on the `comments` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `language` on the `comments` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(10)`.
  - You are about to alter the column `overall_sentiment_score` on the `comments` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - The `additional_insights` column on the `comments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `personality_traits` column on the `comments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `posts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `description` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail_url` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `posts` table. All the data in the column will be lost.
  - Added the required column `platform` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PlatformType" AS ENUM ('INSTAGRAM', 'TELEGRAM');

-- CreateEnum
CREATE TYPE "SentimentType" AS ENUM ('VERY_POSITIVE', 'POSITIVE', 'SLIGHTLY_POSITIVE', 'NEUTRAL', 'SLIGHTLY_NEGATIVE', 'NEGATIVE', 'VERY_NEGATIVE', 'MIXED', 'SARCASTIC', 'IRONIC');

-- CreateEnum
CREATE TYPE "ConfidenceLevel" AS ENUM ('VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH', 'CERTAIN');

-- CreateEnum
CREATE TYPE "AnalysisStatus" AS ENUM ('PENDING', 'COLLECTING_DATA', 'ANALYZING_DATA', 'COMPLETED', 'FAILED', 'CANCELLED', 'PAUSED');

-- CreateEnum
CREATE TYPE "TelegramAccountStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'ERROR', 'DELETED');

-- CreateEnum
CREATE TYPE "InstagramSelectorType" AS ENUM ('META_OG_IMAGE', 'META_OG_DESCRIPTION', 'USERNAME', 'LOGIN_FORM', 'SUBMIT_BUTTON', 'USERNAME_INPUT', 'PASSWORD_INPUT', 'COMMENTS', 'LIKES_COUNT', 'COMMENTS_COUNT', 'POST_DATE', 'AUTHOR_AVATAR', 'AUTHOR_VERIFIED', 'LOGIN_USERNAME', 'LOGIN_PASSWORD', 'LOGIN_SUBMIT', 'LOAD_MORE_COMMENTS', 'COMMENT_USERNAME', 'COMMENT_TEXT', 'COMMENT_LIKES', 'COMMENT_REPLIES');

-- CreateEnum
CREATE TYPE "InstagramSelectorStatus" AS ENUM ('ACTIVE', 'ERROR', 'DELETED');

-- DropForeignKey
ALTER TABLE "analyses" DROP CONSTRAINT "analyses_post_id_foreign";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_post_id_foreign";

-- AlterTable
ALTER TABLE "analyses" DROP CONSTRAINT "analyses_pkey",
ADD COLUMN     "started_at" TIMESTAMP(3),
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "post_id" SET DATA TYPE TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "AnalysisStatus" NOT NULL DEFAULT 'PENDING',
ADD CONSTRAINT "analyses_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "analyses_id_seq";

-- AlterTable
ALTER TABLE "comments" DROP CONSTRAINT "comments_pkey",
DROP COLUMN "comment",
DROP COLUMN "username",
ADD COLUMN     "author_avatar_path" TEXT,
ADD COLUMN     "author_followers_count" INTEGER,
ADD COLUMN     "author_full_name" VARCHAR(200),
ADD COLUMN     "author_platform_id" TEXT,
ADD COLUMN     "author_username" VARCHAR(255),
ADD COLUMN     "author_verified" BOOLEAN DEFAULT false,
ADD COLUMN     "confidence_level" "ConfidenceLevel",
ADD COLUMN     "content" TEXT,
ADD COLUMN     "emotion_scores" JSONB,
ADD COLUMN     "is_reply" BOOLEAN DEFAULT false,
ADD COLUMN     "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "likes_count" INTEGER DEFAULT 0,
ADD COLUMN     "parent_platform_id" TEXT,
ADD COLUMN     "platform_id" TEXT,
ADD COLUMN     "processed_at" TIMESTAMP(3),
ADD COLUMN     "published_at" TIMESTAMP(3),
ADD COLUMN     "reactions" JSONB DEFAULT '{}',
ADD COLUMN     "replies_count" INTEGER DEFAULT 0,
ADD COLUMN     "sentiment_score" DOUBLE PRECISION,
ADD COLUMN     "sentiment_type" "SentimentType",
ADD COLUMN     "shares_count" INTEGER DEFAULT 0,
ADD COLUMN     "thumbnail_path" TEXT,
ADD COLUMN     "topics" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "views_count" INTEGER DEFAULT 0,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "post_id" SET DATA TYPE TEXT,
ALTER COLUMN "rating" SET DATA TYPE SMALLINT,
ALTER COLUMN "satisfaction_score" SET DATA TYPE SMALLINT,
DROP COLUMN "positive_sentences",
ADD COLUMN     "positive_sentences" JSONB,
ALTER COLUMN "tone" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "language" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "overall_sentiment_score" SET DATA TYPE SMALLINT,
DROP COLUMN "additional_insights",
ADD COLUMN     "additional_insights" JSONB,
DROP COLUMN "personality_traits",
ADD COLUMN     "personality_traits" JSONB,
ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "comments_id_seq";

-- AlterTable
ALTER TABLE "posts" DROP CONSTRAINT "posts_pkey",
DROP COLUMN "description",
DROP COLUMN "thumbnail_url",
DROP COLUMN "username",
ADD COLUMN     "author_avatar_path" TEXT,
ADD COLUMN     "author_followers_count" INTEGER,
ADD COLUMN     "author_full_name" VARCHAR(200),
ADD COLUMN     "author_platform_id" TEXT,
ADD COLUMN     "author_username" VARCHAR(100),
ADD COLUMN     "author_verified" BOOLEAN DEFAULT false,
ADD COLUMN     "comments_count" INTEGER DEFAULT 0,
ADD COLUMN     "content" TEXT,
ADD COLUMN     "likes_count" INTEGER DEFAULT 0,
ADD COLUMN     "platform" "PlatformType" NOT NULL,
ADD COLUMN     "platform_id" TEXT,
ADD COLUMN     "published_at" TIMESTAMP(3),
ADD COLUMN     "reactions" JSONB DEFAULT '{}',
ADD COLUMN     "shares_count" INTEGER DEFAULT 0,
ADD COLUMN     "thumbnail_path" TEXT,
ADD COLUMN     "title" VARCHAR(500),
ADD COLUMN     "views_count" INTEGER DEFAULT 0,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "url" SET DATA TYPE VARCHAR(500),
ADD CONSTRAINT "posts_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "posts_id_seq";

-- DropEnum
DROP TYPE "analyses_status";

-- CreateTable
CREATE TABLE "instagram_selectors" (
    "id" TEXT NOT NULL,
    "type" "InstagramSelectorType" NOT NULL,
    "selector" TEXT NOT NULL,
    "description" TEXT,
    "status" "InstagramSelectorStatus" NOT NULL DEFAULT 'ACTIVE',
    "usage_count" INTEGER NOT NULL DEFAULT 0,
    "success_count" INTEGER NOT NULL DEFAULT 0,
    "failure_count" INTEGER NOT NULL DEFAULT 0,
    "last_tested_at" TIMESTAMP(3),
    "last_success_at" TIMESTAMP(3),
    "last_failure_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "instagram_selectors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "telegram_accounts" (
    "id" TEXT NOT NULL,
    "platform_id" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100),
    "username" VARCHAR(100),
    "session" TEXT NOT NULL,
    "password" VARCHAR(255),
    "status" "TelegramAccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "telegram_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "instagram_selectors_type_idx" ON "instagram_selectors"("type");

-- CreateIndex
CREATE INDEX "instagram_selectors_status_idx" ON "instagram_selectors"("status");

-- CreateIndex
CREATE INDEX "instagram_selectors_last_tested_at_idx" ON "instagram_selectors"("last_tested_at");

-- CreateIndex
CREATE UNIQUE INDEX "telegram_accounts_platform_id_key" ON "telegram_accounts"("platform_id");

-- CreateIndex
CREATE INDEX "telegram_accounts_platform_id_idx" ON "telegram_accounts"("platform_id");

-- CreateIndex
CREATE INDEX "telegram_accounts_phone_idx" ON "telegram_accounts"("phone");

-- CreateIndex
CREATE INDEX "telegram_accounts_status_idx" ON "telegram_accounts"("status");

-- CreateIndex
CREATE INDEX "analyses_status_idx" ON "analyses"("status");

-- CreateIndex
CREATE INDEX "analyses_created_at_idx" ON "analyses"("created_at");

-- CreateIndex
CREATE INDEX "comments_platform_id_idx" ON "comments"("platform_id");

-- CreateIndex
CREATE INDEX "comments_post_id_idx" ON "comments"("post_id");

-- CreateIndex
CREATE INDEX "comments_author_platform_id_idx" ON "comments"("author_platform_id");

-- CreateIndex
CREATE INDEX "comments_author_username_idx" ON "comments"("author_username");

-- CreateIndex
CREATE INDEX "comments_published_at_idx" ON "comments"("published_at");

-- CreateIndex
CREATE INDEX "posts_platform_idx" ON "posts"("platform");

-- CreateIndex
CREATE INDEX "posts_platform_id_idx" ON "posts"("platform_id");

-- CreateIndex
CREATE INDEX "posts_author_platform_id_idx" ON "posts"("author_platform_id");

-- CreateIndex
CREATE INDEX "posts_author_username_idx" ON "posts"("author_username");

-- CreateIndex
CREATE INDEX "posts_published_at_idx" ON "posts"("published_at");

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
