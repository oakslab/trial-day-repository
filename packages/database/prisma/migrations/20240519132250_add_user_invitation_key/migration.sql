/*
  Warnings:

  - A unique constraint covering the columns `[invitationKey]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "invitationKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_invitationKey_key" ON "User"("invitationKey");
