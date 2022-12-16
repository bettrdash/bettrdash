/*
  Warnings:

  - Made the column `ownerId` on table `Website` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Website" ALTER COLUMN "ownerId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Website" ADD CONSTRAINT "Website_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
