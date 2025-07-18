/*
  Warnings:

  - The values [Up,Down] on the enum `WebsiteStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "WebsiteStatus_new" AS ENUM ('Good', 'Bad');
ALTER TABLE "WebsiteTick" ALTER COLUMN "status" TYPE "WebsiteStatus_new" USING ("status"::text::"WebsiteStatus_new");
ALTER TYPE "WebsiteStatus" RENAME TO "WebsiteStatus_old";
ALTER TYPE "WebsiteStatus_new" RENAME TO "WebsiteStatus";
DROP TYPE "WebsiteStatus_old";
COMMIT;
