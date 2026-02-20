/*
  Warnings:

  - A unique constraint covering the columns `[referralCode]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "CommissionStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "referralCode" TEXT,
ADD COLUMN     "referredById" UUID;

-- CreateTable
CREATE TABLE "commission" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "referrerId" UUID NOT NULL,
    "referredUserId" UUID NOT NULL,
    "paymentId" TEXT NOT NULL,
    "commissionPct" DECIMAL(5,2) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "status" "CommissionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "commission_referrerId_idx" ON "commission"("referrerId");

-- CreateIndex
CREATE UNIQUE INDEX "user_referralCode_key" ON "user"("referralCode");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission" ADD CONSTRAINT "commission_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
