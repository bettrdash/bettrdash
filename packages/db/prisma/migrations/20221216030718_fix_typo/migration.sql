/*
  Warnings:

  - You are about to drop the column `live_url` on the `Website` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "live_url" TEXT;

-- AlterTable
ALTER TABLE "Website" DROP COLUMN "live_url";
