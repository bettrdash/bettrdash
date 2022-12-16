-- AlterTable
ALTER TABLE "Website" ADD COLUMN     "live_url" TEXT,
ALTER COLUMN "environment" DROP NOT NULL;
