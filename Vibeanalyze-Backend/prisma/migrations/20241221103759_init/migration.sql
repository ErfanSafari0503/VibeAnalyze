-- CreateEnum
CREATE TYPE "analyses_status" AS ENUM ('started', 'getting_data', 'analyzing_data', 'finished', 'failed', 'stopped');

-- CreateTable
CREATE TABLE "analyses" (
    "id" BIGSERIAL NOT NULL,
    "post_id" BIGINT NOT NULL,
    "status" "analyses_status" NOT NULL,
    "status_description" TEXT,
    "conclusion" TEXT,
    "finished_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" BIGSERIAL NOT NULL,
    "post_id" BIGINT NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "comment" TEXT NOT NULL,
    "rating" INTEGER,
    "satisfaction_score" INTEGER,
    "liked" BOOLEAN,
    "positive_sentences" INTEGER,
    "tone" VARCHAR(255),
    "language" VARCHAR(255),
    "overall_sentiment_score" INTEGER,
    "additional_insights" TEXT,
    "personality_traits" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" BIGSERIAL NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "thumbnail_url" TEXT,
    "username" VARCHAR(50),
    "description" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_post_id_foreign" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_foreign" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
