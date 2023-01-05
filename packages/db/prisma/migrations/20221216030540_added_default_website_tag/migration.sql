-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "defaultWebsiteId" INTEGER;

-- AlterTable
ALTER TABLE "Website" ADD COLUMN     "default" BOOLEAN NOT NULL DEFAULT false;
