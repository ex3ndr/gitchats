/*
  Warnings:

  - The `photo` column on the `GithubProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `photo` column on the `OnboardingState` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `photo` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "GithubProfile" DROP COLUMN "photo",
ADD COLUMN     "photo" JSONB;

-- AlterTable
ALTER TABLE "OnboardingState" DROP COLUMN "photo",
ADD COLUMN     "photo" JSONB;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "photo",
ADD COLUMN     "photo" JSONB;
