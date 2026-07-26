/*
  Warnings:

  - You are about to drop the column `userId` on the `sessions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_userId_fkey";

-- DropIndex
DROP INDEX "sessions_userId_idx";

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "userId";
