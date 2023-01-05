/*
  Warnings:

  - You are about to drop the column `live_url` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "live_url",
ALTER COLUMN "language" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;
