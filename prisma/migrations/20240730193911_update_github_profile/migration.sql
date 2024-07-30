/*
  Warnings:

  - Added the required column `username` to the `GithubProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GithubProfile" ADD COLUMN     "username" TEXT NOT NULL,
ALTER COLUMN "lastName" DROP NOT NULL,
ALTER COLUMN "photo" DROP NOT NULL;
