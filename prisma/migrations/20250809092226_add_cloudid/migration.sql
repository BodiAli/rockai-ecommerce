/*
  Warnings:

  - Added the required column `cloudId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "cloudId" TEXT NOT NULL;
