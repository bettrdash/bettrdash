-- DropForeignKey
ALTER TABLE "Website" DROP CONSTRAINT "Website_projectId_fkey";

-- AlterTable
ALTER TABLE "Website" ALTER COLUMN "projectId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Website" ADD CONSTRAINT "Website_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
