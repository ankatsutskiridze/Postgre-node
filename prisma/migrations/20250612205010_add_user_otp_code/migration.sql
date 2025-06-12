/*
  Warnings:

  - You are about to drop the column `otepCode` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "otepCode",
ADD COLUMN     "otpCode" VARCHAR(6);
